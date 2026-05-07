import { getSession, setClientAgent } from "lib/demo-store";
import { createAgent } from "lib/identity/agent";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * POST /api/agents/client
 *
 * Creates the client agent in memory. Derives a DID and DID document with
 * service endpoints that map to the namespaced app-router protocol paths:
 *   POST /api/agents/client/chat
 *   POST /api/agents/client/identity/challenge
 *   GET  /api/agents/client/identity/vc
 *
 * Requires the client owner to have been created first (step 01).
 */
export async function POST() {
	const session = getSession();

	if (!session.clientOwner) {
		return NextResponse.json(
			{ error: "Client owner must be created before the client agent." },
			{ status: 400 }
		);
	}

	const headersList = await headers();
	const host = headersList.get("host") ?? "localhost:3000";
	const proto = process.env.NODE_ENV === "production" ? "https" : "http";
	const baseUrl = `${proto}://${host}`;

	const agent = await createAgent({
		namespace: "client",
		baseUrl,
		controller: session.clientOwner.did,
	});
	setClientAgent(agent);

	return NextResponse.json({
		did: agent.did,
		didDocument: agent.didDocument,
	});
}

/**
 * GET /api/agents/client
 *
 * Returns the current client agent state, or null if not yet created.
 */
export function GET() {
	const session = getSession();

	return NextResponse.json({
		clientAgent: session.clientAgent
			? {
					did: session.clientAgent.did,
					didDocument: session.clientAgent.didDocument,
				}
			: null,
	});
}
