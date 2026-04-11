#!/usr/bin/env bun

/**
 * start.ts — start the ping server AND the Cloudflare Tunnel together.
 *
 * Sequence:
 *  1. Start the Bun HTTP server (src/server.ts) on LOCAL_MACHINE_PORT.
 *  2. Start the cloudflared tunnel (scripts/tunnel.ts).
 *  3. Wait. Tunnel stays alive until SIGINT/SIGTERM or a child crashes.
 *
 * Usage:
 *   bun run start
 */

import { env } from "@/env";
import { spawnTunnel } from "./tunnel";

function log(msg: string) {
	console.log(`[local-machine] ${msg}`);
}

const PORT = env.LOCAL_MACHINE_PORT;
const CF_TUNNEL_TOKEN = env.CF_TUNNEL_TOKEN;

if (!CF_TUNNEL_TOKEN) {
	console.error(
		"[local-machine] ERROR: CF_TUNNEL_TOKEN is not set.\n" +
			"See packages/local-machine/GUIDE.md → Step 3 for setup instructions."
	);
	process.exit(1);
}

// ── Step 1: start the ping server ─────────────────────────────────────────
const serverProc = Bun.spawn(["bun", "src/server.ts"], {
	cwd: `${import.meta.dir}/..`,
	stdout: "inherit",
	stderr: "inherit",
	env: { ...process.env },
});

log(`Ping server starting on http://localhost:${PORT}…`);

// Give the server a moment to bind before cloudflared starts forwarding.
await Bun.sleep(500);

// ── Step 2: start the tunnel ───────────────────────────────────────────────
const tunnelProc = spawnTunnel(CF_TUNNEL_TOKEN, env.CF_TUNNEL_HOSTNAME);

const cleanup = () => {
	log("Shutting down…");
	tunnelProc.kill();
	serverProc.kill();
	process.exit(0);
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

log("All systems up. Press Ctrl-C to stop.");

// ── Step 3: wait ──────────────────────────────────────────────────────────
const exitCode = await Promise.race([serverProc.exited, tunnelProc.exited]);
log(`A child process exited with code ${exitCode} — shutting down.`);
cleanup();
