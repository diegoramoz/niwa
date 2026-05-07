import { getSession, setServerOwner } from "lib/demo-store";
import { createOwner } from "lib/identity/owner";
import { NextResponse } from "next/server";

/**
 * POST /api/owners/server
 *
 * Creates the server owner in memory. The client-side setup (owner, agent, and
 * VC issuance) must be completed before the server side can be set up.
 *
 * Requires the client ownership VC (step 03) to have been issued first.
 */
export async function POST() {
	const session = getSession();

	if (!session.clientOwnershipVC) {
		return NextResponse.json(
			{
				error:
					"Client ownership VC must be issued before setting up the server owner.",
			},
			{ status: 400 }
		);
	}

	const owner = await createOwner();
	setServerOwner(owner);

	return NextResponse.json({
		did: owner.did,
		didDocument: owner.didDocument,
	});
}

/**
 * GET /api/owners/server
 *
 * Returns the current server owner state, or null if not yet created.
 */
export function GET() {
	const session = getSession();

	return NextResponse.json({
		serverOwner: session.serverOwner
			? {
					did: session.serverOwner.did,
					didDocument: session.serverOwner.didDocument,
				}
			: null,
	});
}
