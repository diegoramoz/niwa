#!/usr/bin/env bun

/**
 * tunnel.ts — start a Cloudflare Tunnel that exposes the local ping server.
 *
 * What this script does, step by step:
 *
 *  1. Read CF_TUNNEL_TOKEN from the environment.
 *  2. Spawn `cloudflared tunnel run --token <token>`.
 *     cloudflared opens a persistent outbound connection to Cloudflare's edge.
 *  3. Cloudflare routes public HTTPS requests for your tunnel hostname to that
 *     connection, which forwards them to http://localhost:<LOCAL_MACHINE_PORT>.
 *
 * Usage (standalone):
 *   bun run tunnel
 *
 * Also exported as `spawnTunnel()` for use inside start.ts.
 */

import type { Subprocess } from "bun";
import { env } from "@/env";

function log(msg: string) {
	console.log(`[local-machine:tunnel] ${msg}`);
}

/**
 * Spawn `cloudflared tunnel run --token <token>` and return the child process.
 *
 * cloudflared connects outbound to Cloudflare's global network on port 7844
 * (QUIC) or 443 (HTTP/2 fallback). No inbound firewall rules are needed.
 */
export function spawnTunnel(token: string, hostname?: string): Subprocess {
	log("Starting cloudflared tunnel…");

	const proc = Bun.spawn(["cloudflared", "tunnel", "run", "--token", token], {
		stdout: "inherit",
		stderr: "inherit",
	});

	if (hostname) {
		log(`Tunnel running → https://${hostname}`);
		log(`Try: curl https://${hostname}/ping`);
	} else {
		log(
			"Tunnel running. Set CF_TUNNEL_HOSTNAME in .env to print the public URL."
		);
	}

	return proc;
}

async function main() {
	const token = env.CF_TUNNEL_TOKEN;

	if (!token) {
		console.error(
			"[local-machine:tunnel] ERROR: CF_TUNNEL_TOKEN is not set.\n" +
				"See packages/local-machine/GUIDE.md → Step 3 for setup instructions."
		);
		process.exit(1);
	}

	const tunnelProc = spawnTunnel(token, env.CF_TUNNEL_HOSTNAME);

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
