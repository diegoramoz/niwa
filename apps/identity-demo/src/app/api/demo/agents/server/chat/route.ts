import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/demo-store";

const HAIKUS = [
	"Keys exchanged in trust,\nIdentity proven true —\nThe gate opens wide.",
	"A signature blooms,\nThe controller speaks clearly —\nFulfillment arrives.",
	"DID documents dance,\nCredentials verify both sides —\nTrust is mutual now.",
	"Challenge and response,\nOwnership confirmed by proof —\nThe haiku is yours.",
	"Cryptographic vow,\nTwo agents recognise each —\nWords may finally flow.",
];

function pickHaiku(message: string): string {
	// Deterministic pick based on message length so the response is stable
	// within a session while still varying across different messages.
	return HAIKUS[message.length % HAIKUS.length];
}

/**
 * POST /api/demo/agents/server/chat
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
		haiku: pickHaiku(message),
	});
}
