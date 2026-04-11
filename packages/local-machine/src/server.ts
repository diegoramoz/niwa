#!/usr/bin/env bun

/**
 * server.ts — the local ping server.
 *
 * Exposes a single HTTP endpoint:
 *
 *   GET /ping
 *   → 200  { pong: true, machine: "local", timestamp: "<ISO>" }
 *
 * Cloudflare Tunnel proxies public HTTPS traffic to this server.
 * The internet calls https://<your-tunnel-hostname>/ping and the
 * request arrives here, on your laptop, as plain HTTP on LOCAL_MACHINE_PORT.
 *
 * Usage (standalone — no tunnel):
 *   bun run ping
 *
 * Usage (with tunnel, via start.ts):
 *   bun run start
 */

import { env } from "@/env";

const PORT = env.LOCAL_MACHINE_PORT;

const server = Bun.serve({
	port: PORT,

	fetch(req) {
		const url = new URL(req.url);

		// ── Health / liveness ──────────────────────────────────────────────
		if (req.method === "GET" && url.pathname === "/ping") {
			return Response.json({
				pong: true,
				machine: "local",
				timestamp: new Date().toISOString(),
			});
		}

		// ── Catch-all ─────────────────────────────────────────────────────
		return new Response("Not found", { status: 404 });
	},
});

console.log(
	`[local-machine] ping server listening on http://localhost:${server.port}`
);
console.log(`[local-machine] GET http://localhost:${server.port}/ping`);
