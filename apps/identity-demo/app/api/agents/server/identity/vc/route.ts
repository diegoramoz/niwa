import { getSession } from "lib/demo-store";
import { NextResponse } from "next/server";

/**
 * GET /api/agents/server/identity/vc
 *
 * DID document service endpoint — returns the signed ownership VC JWT for the
 * server agent if one has been issued, or 404 if not yet issued.
 */
export function GET() {
	const session = getSession();

	if (!session.serverOwnershipVC) {
		return NextResponse.json(
			{ error: "No server ownership credential has been issued yet." },
			{ status: 404 }
		);
	}

	return NextResponse.json({ jwt: session.serverOwnershipVC.jwt });
}
