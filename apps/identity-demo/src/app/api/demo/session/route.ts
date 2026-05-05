import { NextResponse } from "next/server";
import { getSession, setClientOwner } from "@/lib/demo-store";
import { createOwner } from "@/lib/identity/owner";

/**
 * POST /api/demo/session
 *
 * Initialises (or re-initialises) the default demo session by creating a new
 * client owner keypair and DID. Returns the owner DID and DID document so the
 * browser can render them directly.
 */
export async function POST() {
	const owner = await createOwner();
	setClientOwner(owner);

	return NextResponse.json({
		did: owner.did,
		didDocument: owner.didDocument,
	});
}

/**
 * GET /api/demo/session
 *
 * Returns the current session state. Returns null for clientOwner if the
 * session has not been initialised yet.
 */
export function GET() {
	const session = getSession();

	return NextResponse.json({
		id: session.id,
		clientOwner: session.clientOwner
			? {
					did: session.clientOwner.did,
					didDocument: session.clientOwner.didDocument,
				}
			: null,
	});
}
