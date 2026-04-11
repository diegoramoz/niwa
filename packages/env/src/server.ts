import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		UPLOADTHING_TOKEN: z.string().min(1),
		UPLOADTHING_APP_ID: z.string().min(1),
		RESEND_API_KEY: z.string().min(1),
		BETTER_AUTH_URL: z.url(),
		POLAR_ACCESS_TOKEN: z.string().min(1),
		POLAR_SUCCESS_URL: z.url(),
		CORS_ORIGIN: z.url(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		OLLAMA_URL: z.url().optional(),
		OLLAMA_MODEL: z.string().default("llama3.2-vision"),
		CF_ACCESS_CLIENT_ID: z.string().min(1),
		CF_ACCESS_CLIENT_SECRET: z.string().min(1),
		LOCAL_MACHINE_PING_URL: z.url().default("http://localhost:7001"),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
