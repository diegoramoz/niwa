#!/usr/bin/env bun

/**
 * tunnel.ts — start a Cloudflare Tunnel for the local Ollama instance.
 *
 * Usage (standalone):
 *   bun run tunnel
 *
 * Also exported as `spawnTunnel()` for use inside start.ts.
 */

import { resolve } from "node:path";
import type { Subprocess } from "bun";
import { config as loadDotenv } from "dotenv";

loadDotenv({ path: resolve(import.meta.dir, "../.env") });

function log(msg: string) {
	console.log(`[llm:tunnel] ${msg}`);
}

/**
 * Spawn `cloudflared tunnel run --token <token>` and return the child process.
 * Prints the public hostname if provided.
 */
export function spawnTunnel(token: string, hostname?: string): Subprocess {
	log("Starting cloudflared tunnel…");
	const proc = Bun.spawn(["cloudflared", "tunnel", "run", "--token", token], {
		stdout: "inherit",
		stderr: "inherit",
	});

	if (hostname) {
		log(`Tunnel running → https://${hostname}`);
	} else {
		log(
			"Tunnel running. Set CF_TUNNEL_HOSTNAME in .env to print the public URL."
		);
	}

	return proc;
}

async function main() {
	const token = process.env.CF_TUNNEL_TOKEN;
	if (!token) {
		console.error(
			"[llm:tunnel] ERROR: CF_TUNNEL_TOKEN is not set.\n" +
				"See packages/llm/README.md for the one-time Cloudflare setup runbook."
		);
		process.exit(1);
	}

	const tunnelProc = spawnTunnel(token, process.env.CF_TUNNEL_HOSTNAME);

	const cleanup = () => {
		log("Shutting down tunnel…");
		tunnelProc.kill();
		process.exit(0);
	};
	process.on("SIGINT", cleanup);
	process.on("SIGTERM", cleanup);

	await tunnelProc.exited;
}

if (import.meta.main) {
	await main();
}
