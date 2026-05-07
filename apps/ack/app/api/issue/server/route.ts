import { getSession, setServerOwnershipVC } from "lib/demo-store";
import { issueOwnershipCredential } from "lib/identity/credential";
import { NextResponse } from "next/server";

/**
 * POST /api/vc/issue/server
 *
 * Issues a ControllerCredential attesting that the server owner controls the
 * server agent. Both the raw JWT and the verification outcome are stored in
 * the session and returned for browser inspection.
 *
 * Requires both the server owner (step 04) and server agent (step 05) to
 * exist in the session.
 */
export async function POST() {
	const session = getSession();

	if (!session.serverOwner) {
		return NextResponse.json(
			{ error: "Server owner must be created before issuing a credential." },
			{ status: 400 }
		);
	}

	if (!session.serverAgent) {
		return NextResponse.json(
			{ error: "Server agent must be created before issuing a credential." },
			{ status: 400 }
		);
	}

	const result = await issueOwnershipCredential({
		ownerDid: session.serverOwner.did,
		ownerSigner: session.serverOwner.signer,
		ownerAlgorithm: session.serverOwner.algorithm,
		agentDid: session.serverAgent.did,
		agentDidDocument: session.serverAgent.didDocument,
	});

	setServerOwnershipVC(result);

	return NextResponse.json(result);
}
