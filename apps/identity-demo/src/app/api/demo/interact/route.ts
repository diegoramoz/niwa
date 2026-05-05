import {
	getControllerClaimVerifier,
	getDidResolver,
	parseJwtCredential,
	verifyParsedCredential,
} from "agentcommercekit";
import { NextResponse } from "next/server";
import { getSession, setIdentityVerified } from "@/lib/demo-store";

/**
 * POST /api/demo/interact
 *
 * Orchestrates the mutual DID exchange between client and server agents:
 *  1. Server verifies the client's ownership VC
 *  2. Client verifies the server's ownership VC
 *  3. Marks the session as identity-verified
 *
 * Both VC JWTs must have been issued before calling this endpoint (steps 3 & 6).
 * Returns a step-by-step verification log for UI inspection.
 */
export async function POST() {
	const session = getSession();

	if (!session.clientOwnershipVC) {
		return NextResponse.json(
			{ error: "Client ownership VC not yet issued (complete step 3 first)." },
			{ status: 400 }
		);
	}

	if (!session.serverOwnershipVC) {
		return NextResponse.json(
			{
				error: "Server ownership VC not yet issued (complete step 6 first).",
			},
			{ status: 400 }
		);
	}

	const resolver = getDidResolver();
	const log: string[] = [];

	// — Step 1: server agent verifies client's ownership VC —
	log.push("→ Server agent receives client's ownership VC JWT");
	try {
		const parsed = await parseJwtCredential(
			session.clientOwnershipVC.jwt,
			resolver
		);
		const issuerDid =
			typeof parsed.issuer === "string" ? parsed.issuer : parsed.issuer.id;
		await verifyParsedCredential(parsed, {
			resolver,
			trustedIssuers: [issuerDid],
			verifiers: [getControllerClaimVerifier()],
		});
		log.push("✓ Server agent verified client ownership VC");
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Verification failed";
		log.push(`✗ Server agent failed to verify client VC: ${msg}`);
		return NextResponse.json(
			{ error: `Client VC verification failed: ${msg}`, log },
			{ status: 400 }
		);
	}

	// — Step 2: server agent returns its own VC; client verifies it —
	log.push("→ Server agent returns its ownership VC JWT");
	log.push("→ Client agent receives server's ownership VC JWT");
	try {
		const parsed = await parseJwtCredential(
			session.serverOwnershipVC.jwt,
			resolver
		);
		const issuerDid =
			typeof parsed.issuer === "string" ? parsed.issuer : parsed.issuer.id;
		await verifyParsedCredential(parsed, {
			resolver,
			trustedIssuers: [issuerDid],
			verifiers: [getControllerClaimVerifier()],
		});
		log.push("✓ Client agent verified server ownership VC");
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Verification failed";
		log.push(`✗ Client agent failed to verify server VC: ${msg}`);
		return NextResponse.json(
			{ error: `Server VC verification failed: ${msg}`, log },
			{ status: 400 }
		);
	}

	log.push("✓ Mutual identity verification complete — interaction gate open");

	setIdentityVerified(log);

	return NextResponse.json({ verified: true, log });
}

/**
 * GET /api/demo/interact
 *
 * Returns the current verification state and log for the session.
 */
export function GET() {
	const session = getSession();

	return NextResponse.json({
		verified: session.identityVerified,
		log: session.verificationLog,
	});
}
