import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		/**
		 * The port the local ping server listens on.
		 * Cloudflared will forward tunnel traffic to this port.
		 */
		LOCAL_MACHINE_PORT: z.coerce.number().default(7001),

		/**
		 * Token obtained from the Cloudflare dashboard when creating a tunnel.
		 * Run: cloudflared tunnel token <tunnel-name>
		 */
		CF_TUNNEL_TOKEN: z.string().optional(),

		/**
		 * The public hostname Cloudflare routes to this tunnel, e.g.
		 * "ping.example.com". Used only for a human-readable log line.
		 */
		CF_TUNNEL_HOSTNAME: z.string().optional(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
