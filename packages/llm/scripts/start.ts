#!/usr/bin/env bun

/**
 * start.ts — start Ollama (native) and expose it via Cloudflare Tunnel.
 *
 * Usage:
 *   bun run start
 */

import type { Subprocess } from "bun";
import { env } from "@/env";
import { spawnTunnel } from "./tunnel";

const OLLAMA_URL = "http://localhost:11434";
const OLLAMA_TARGET = new URL(OLLAMA_URL);
const POLL_INTERVAL_MS = 500;
const POLL_TIMEOUT_MS = 30_000;

function log(msg: string) {
	console.log(`[llm] ${msg}`);
}

function checkOllamaInstalled(): boolean {
	const result = Bun.spawnSync(["which", "ollama"]);
	return result.exitCode === 0;
}

function startProxyServer(proxyPort: number): Bun.Server<unknown> {
	const server = Bun.serve({
		port: proxyPort,
		async fetch(req) {
			const reqUrl = new URL(req.url);
			const upstreamUrl = new URL(
				reqUrl.pathname + reqUrl.search,
				OLLAMA_TARGET
			);

			const headers = new Headers(req.headers);
			headers.set("host", OLLAMA_TARGET.host);

			const method = req.method.toUpperCase();
			const init: RequestInit = {
				method,
				headers,
				redirect: "manual",
			};

			if (method !== "GET" && method !== "HEAD") {
				init.body = req.body;
			}

			try {
				const upstream = await fetch(upstreamUrl, init);
				return new Response(upstream.body, {
					status: upstream.status,
					statusText: upstream.statusText,
					headers: upstream.headers,
				});
			} catch (error) {
				const reason = error instanceof Error ? error.message : String(error);
				return Response.json(
					{
						error: "Failed to reach Ollama upstream",
						upstream: OLLAMA_URL,
						reason,
					},
					{ status: 502 }
				);
			}
		},
	});

	log(`Proxy listening on http://localhost:${server.port} -> ${OLLAMA_URL}`);

	return server;
}

async function waitForOllama(url: string, timeoutMs: number): Promise<void> {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		try {
			const res = await fetch(`${url}/api/tags`);
			if (res.ok) {
				return;
			}
		} catch {
			// not ready yet
		}
		await Bun.sleep(POLL_INTERVAL_MS);
	}
	throw new Error(`Ollama did not become ready within ${timeoutMs / 1000}s`);
}

async function main() {
	if (!checkOllamaInstalled()) {
		console.error(
			"[llm] ERROR: ollama CLI not found.\n" +
				"Install it from https://ollama.com/download, then run `bun run start` again."
		);
		process.exit(1);
	}

	const CF_TUNNEL_TOKEN = env.CF_TUNNEL_TOKEN;
	if (!CF_TUNNEL_TOKEN) {
		console.error(
			"[llm] ERROR: CF_TUNNEL_TOKEN is not set.\n" +
				"See packages/llm/README.md for the one-time Cloudflare setup runbook."
		);
		process.exit(1);
	}

	let ollamaProc: Subprocess | null = null;
	const proxyServer = startProxyServer(env.LLM_PROXY_PORT);

	// Check if Ollama is already running; if not, start it.
	try {
		const res = await fetch(`${OLLAMA_URL}/api/tags`);
		if (res.ok) {
			log(`Detected existing Ollama instance at ${OLLAMA_URL} — reusing it.`);
		}
	} catch {
		log("Starting ollama serve…");
		ollamaProc = Bun.spawn(["ollama", "serve"], {
			stdout: "inherit",
			stderr: "inherit",
		});
	}

	let tunnelProc: Subprocess | null = null;

	const cleanup = () => {
		log("Shutting down…");
		proxyServer.stop();
		tunnelProc?.kill();
		ollamaProc?.kill();
		process.exit(0);
	};
	process.on("SIGINT", cleanup);
	process.on("SIGTERM", cleanup);

	try {
		log(`Waiting for Ollama at ${OLLAMA_URL}…`);
		await waitForOllama(OLLAMA_URL, POLL_TIMEOUT_MS);
		log("Ollama is ready.");

		tunnelProc = spawnTunnel(CF_TUNNEL_TOKEN, env.CF_TUNNEL_HOSTNAME);

		log(
			`Tunnel up. Ollama exposed at https://${env.CF_TUNNEL_HOSTNAME ?? "<hostname>"}`
		);

		const processWatchers = [tunnelProc.exited];
		if (ollamaProc) {
			processWatchers.unshift(ollamaProc.exited);
		}

		await Promise.race(processWatchers);
		log("A child process exited unexpectedly — shutting down.");
		cleanup();
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error(`[llm] ERROR: ${message}`);
		proxyServer.stop();
		tunnelProc?.kill();
		ollamaProc?.kill();
		process.exit(1);
	}
}

await main();
