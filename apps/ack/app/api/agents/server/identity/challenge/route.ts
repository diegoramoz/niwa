import {
	getControllerClaimVerifier,
	getDidResolver,
	parseJwtCredential,
	verifyParsedCredential,
} from "agentcommercekit";
import { getSession } from "lib/demo-store";
import { type NextRequest, NextResponse } from "next/server";

/**
 * POST /api/agents/server/identity/challenge
 *
 * Protocol endpoint — registered as a DID document service endpoint.
 * Verifies the caller's ownership VC and returns the server agent's own
 * ownership VC JWT so the caller can confirm the server agent's identity.
 *
 * Request body: { vcJwt: string }
 * Response body: { verified: true, vcJwt: string }
 */
export async function POST(req: NextRequest) {
	const session = getSession();

	if (!session.serverOwnershipVC) {
		return NextResponse.json(
			{ error: "Server ownership VC not yet issued." },
			{ status: 400 }
		);
	}

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const { vcJwt } = body as { vcJwt?: unknown };

	if (typeof vcJwt !== "string" || !vcJwt) {
		return NextResponse.json(
			{ error: "vcJwt (string) is required." },
			{ status: 400 }
		);
	}

	const resolver = getDidResolver();

	try {
		const parsed = await parseJwtCredential(vcJwt, resolver);
		const issuerDid =
			typeof parsed.issuer === "string" ? parsed.issuer : parsed.issuer.id;
		await verifyParsedCredential(parsed, {
			resolver,
			trustedIssuers: [issuerDid],
			verifiers: [getControllerClaimVerifier()],
		});
	} catch (err) {
		return NextResponse.json(
			{
				error:
					err instanceof Error
						? err.message
						: "Credential verification failed.",
			},
			{ status: 400 }
		);
	}

	return NextResponse.json({
		verified: true,
		vcJwt: session.serverOwnershipVC.jwt,
	});
}
