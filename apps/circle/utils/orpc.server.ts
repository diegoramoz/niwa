import "server-only";

import { createRouterClient } from "@orpc/server";
import { appRouter } from "@oss/api/routers/index";
import { auth } from "@oss/auth";
import { headers } from "next/headers";

globalThis.$orpc = createRouterClient(appRouter, {
	context: async () => {
		const headers_ = await headers();
		return {
			auth: null,
			session: await auth.api.getSession({ headers: headers_ }),
		};
	},
});
