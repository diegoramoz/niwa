import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
		PORT: z.coerce.number().optional(),
		PRIVATE_KEY: z.string(),
		CIRCLE_KIT_KEY: z.string().optional(),
	},
	client: {},
	runtimeEnv: {
		VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
		PORT: process.env.PORT,
		PRIVATE_KEY: process.env.PRIVATE_KEY,
		CIRCLE_KIT_KEY: process.env.CIRCLE_KIT_KEY,
	},
	emptyStringAsUndefined: true,
});
