import { getSession } from "lib/demo-store";
import { haikuPayload } from "lib/identity/payloads/haiku";
import { type NextRequest, NextResponse } from "next/server";

/**
 * POST /api/agents/server/chat
 *
 * Protocol endpoint — registered as a DID document service endpoint.
 * Returns a blocked state when identity verification has not been completed.
 * Fulfills the request with a haiku after successful mutual DID exchange.
 *
 * Request body: { message: string }
 * Response body (blocked): { blocked: true, reason: string }
 * Response body (fulfilled): { message: string, haiku: string }
 */
export async function POST(req: NextRequest) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
	}

	const { message } = body as { message?: unknown };

	if (typeof message !== "string" || !message) {
		return NextResponse.json(
			{ error: "message (string) is required." },
			{ status: 400 }
		);
	}

	const session = getSession();

	if (!session.identityVerified) {
		return NextResponse.json(
			{
				blocked: true,
				reason:
					"Identity verification required. Complete the DID exchange before the server agent will fulfill requests.",
			},
			{ status: 403 }
		);
	}

	return NextResponse.json({
		message: "Request fulfilled after verified identity exchange.",
		haiku: haikuPayload.fulfill(message),
	});
}
