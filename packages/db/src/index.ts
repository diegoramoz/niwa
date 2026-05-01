import { neon } from "@neondatabase/serverless";
import { env } from "@oss/env/server";
import { drizzle } from "drizzle-orm/neon-http";

export function createDb() {
	const sql = neon(env.DATABASE_URL);
	return drizzle({ client: sql });
}

export const db = createDb();
