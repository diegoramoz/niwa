import { getSession, setServerAgent } from "lib/demo-store";
import { createAgent } from "lib/identity/agent";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * POST /api/agents/server
 *
 * Creates the server agent in memory. Derives a DID and DID document with
 * service endpoints that map to the namespaced app-router protocol paths:
 *   POST /api/agents/server/chat
 *   POST /api/agents/server/identity/challenge
 *   GET  /api/agents/server/identity/vc
 *
 * Requires the server owner (step 04) to have been created first.
 */
export async function POST() {
	const session = getSession();

	if (!session.serverOwner) {
		return NextResponse.json(
			{ error: "Server owner must be created before the server agent." },
			{ status: 400 }
		);
	}

	const headersList = await headers();
	const host = headersList.get("host") ?? "localhost:3000";
	const proto = process.env.NODE_ENV === "production" ? "https" : "http";
	const baseUrl = `${proto}://${host}`;

	const agent = await createAgent({
		namespace: "server",
		baseUrl,
		controller: session.serverOwner.did,
	});
	setServerAgent(agent);

	return NextResponse.json({
		did: agent.did,
		didDocument: agent.didDocument,
	});
}

/**
 * GET /api/agents/server
 *
 * Returns the current server agent state, or null if not yet created.
 */
export function GET() {
	const session = getSession();

	return NextResponse.json({
		serverAgent: session.serverAgent
			? {
					did: session.serverAgent.did,
					didDocument: session.serverAgent.didDocument,
				}
			: null,
	});
}
