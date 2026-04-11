import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		LLM_PROXY_PORT: z.coerce.number().default(7002),
		CF_TUNNEL_TOKEN: z.string().optional(),
		CF_TUNNEL_HOSTNAME: z.string().optional(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
