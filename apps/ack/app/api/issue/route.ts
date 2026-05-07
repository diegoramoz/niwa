import { getSession, setClientOwnershipVC } from "lib/demo-store";
import { issueOwnershipCredential } from "lib/identity/credential";
import { NextResponse } from "next/server";

/**
 * POST /api/vc/issue
 *
 * Issues a ControllerCredential attesting that the client owner controls the
 * client agent. Both the raw JWT and the verification outcome are stored in
 * the session and returned for browser inspection.
 *
 * Requires both the client owner (step 01) and client agent (step 02) to
 * exist in the session.
 */
export async function POST() {
	const session = getSession();

	if (!session.clientOwner) {
		return NextResponse.json(
			{ error: "Client owner must be created before issuing a credential." },
			{ status: 400 }
		);
	}

	if (!session.clientAgent) {
		return NextResponse.json(
			{ error: "Client agent must be created before issuing a credential." },
			{ status: 400 }
		);
	}

	const result = await issueOwnershipCredential({
		ownerDid: session.clientOwner.did,
		ownerSigner: session.clientOwner.signer,
		ownerAlgorithm: session.clientOwner.algorithm,
		agentDid: session.clientAgent.did,
		agentDidDocument: session.clientAgent.didDocument,
	});

	setClientOwnershipVC(result);

	return NextResponse.json(result);
}
