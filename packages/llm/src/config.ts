import { z } from "zod";

const configSchema = z.object({
	OLLAMA_MODEL: z.string().default("llama3.2-vision"),
	OLLAMA_URL: z.url().default("http://localhost:11434"),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
	return configSchema.parse(env);
}
