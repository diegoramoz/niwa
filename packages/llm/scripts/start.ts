#!/usr/bin/env bun

/**
 * start.ts — start Ollama (native) and pull the configured model.
 *
 * Usage:
 *   bun run start
 *   OLLAMA_MODEL=llava bun run start
 */

import { resolve } from "node:path";
import type { Subprocess } from "bun";
import { config as loadDotenv } from "dotenv";
import { isModelInList } from "@/ollama-utils";
import { spawnTunnel } from "./tunnel";

loadDotenv({ path: resolve(import.meta.dir, "../.env") });

const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2-vision";
const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";
const POLL_INTERVAL_MS = 500;
const POLL_TIMEOUT_MS = 30_000;

function log(msg: string) {
	console.log(`[llm] ${msg}`);
}

function checkOllamaInstalled(): boolean {
	const result = Bun.spawnSync(["which", "ollama"]);
	return result.exitCode === 0;
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

function isModelPulled(model: string): boolean {
	const result = Bun.spawnSync(["ollama", "list"]);
	if (result.exitCode !== 0) {
		return false;
	}
	const output = new TextDecoder().decode(result.stdout);
	return isModelInList(output, model);
}

async function pullModel(model: string): Promise<void> {
	log(`Pulling model ${model}…`);
	const proc = Bun.spawn(["ollama", "pull", model], {
		stdout: "inherit",
		stderr: "inherit",
	});
	const exitCode = await proc.exited;
	if (exitCode !== 0) {
		throw new Error(`ollama pull exited with code ${exitCode}`);
	}
}

async function main() {
	if (!checkOllamaInstalled()) {
		console.error(
			"[llm] ERROR: ollama CLI not found.\n" +
				"Install it from https://ollama.com/download, then run `bun run start` again."
		);
		process.exit(1);
	}

	const CF_TUNNEL_TOKEN = process.env.CF_TUNNEL_TOKEN;
	if (!CF_TUNNEL_TOKEN) {
		console.error(
			"[llm] ERROR: CF_TUNNEL_TOKEN is not set.\n" +
				"See packages/llm/README.md for the one-time Cloudflare setup runbook."
		);
		process.exit(1);
	}

	log("Starting ollama serve…");
	const ollamaProc = Bun.spawn(["ollama", "serve"], {
		stdout: "inherit",
		stderr: "inherit",
	});

	let tunnelProc: Subprocess | null = null;

	const cleanup = () => {
		log("Shutting down…");
		tunnelProc?.kill();
		ollamaProc.kill();
		process.exit(0);
	};
	process.on("SIGINT", cleanup);
	process.on("SIGTERM", cleanup);

	try {
		log(`Waiting for Ollama at ${OLLAMA_URL}…`);
		await waitForOllama(OLLAMA_URL, POLL_TIMEOUT_MS);
		log("Ollama is ready.");

		if (isModelPulled(OLLAMA_MODEL)) {
			log(`Model ${OLLAMA_MODEL} already present — skipping pull.`);
		} else {
			await pullModel(OLLAMA_MODEL);
		}

		tunnelProc = spawnTunnel(CF_TUNNEL_TOKEN, process.env.CF_TUNNEL_HOSTNAME);

		log(`Ready. Model: ${OLLAMA_MODEL}  Endpoint: ${OLLAMA_URL}`);

		// Keep both processes alive until SIGINT/SIGTERM
		await Promise.race([ollamaProc.exited, tunnelProc.exited]);
		log("A child process exited unexpectedly — shutting down.");
		cleanup();
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		console.error(`[llm] ERROR: ${message}`);
		tunnelProc?.kill();
		ollamaProc.kill();
		process.exit(1);
	}
}

await main();
