import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		AGENT_API_PRIVATE_KEY: z.string().min(1),
		API_PUBLIC_KEY: z.string().min(1),
		API_PRIVATE_KEY: z.string().min(1),
		WEBHOOK_URL: z.url(),
		WEBHOOK_NAME: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_ORGANIZATION_ID: z.string().min(1),
		NEXT_PUBLIC_AUTH_PROXY_CONFIG_ID: z.string().min(1),
		NEXT_PUBLIC_AGENT_API_PUBLIC_KEY: z.string().min(1),
		NEXT_PUBLIC_ALLOWED_RECIPIENT: z.string().min(1),
		NEXT_PUBLIC_APPROVAL_RECIPIENT: z.string().min(1),
		NEXT_PUBLIC_BASE_URL: z.url(),
	},
	runtimeEnv: {
		AGENT_API_PRIVATE_KEY: process.env.AGENT_API_PRIVATE_KEY,
		API_PUBLIC_KEY: process.env.API_PUBLIC_KEY,
		API_PRIVATE_KEY: process.env.API_PRIVATE_KEY,
		WEBHOOK_URL: process.env.WEBHOOK_URL,
		WEBHOOK_NAME: process.env.WEBHOOK_NAME,
		NEXT_PUBLIC_ORGANIZATION_ID: process.env.NEXT_PUBLIC_ORGANIZATION_ID,
		NEXT_PUBLIC_AUTH_PROXY_CONFIG_ID:
			process.env.NEXT_PUBLIC_AUTH_PROXY_CONFIG_ID,
		NEXT_PUBLIC_AGENT_API_PUBLIC_KEY:
			process.env.NEXT_PUBLIC_AGENT_API_PUBLIC_KEY,
		NEXT_PUBLIC_ALLOWED_RECIPIENT: process.env.NEXT_PUBLIC_ALLOWED_RECIPIENT,
		NEXT_PUBLIC_APPROVAL_RECIPIENT: process.env.NEXT_PUBLIC_APPROVAL_RECIPIENT,
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
	},
	emptyStringAsUndefined: true,
});
