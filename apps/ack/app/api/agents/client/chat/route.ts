import { type NextRequest, NextResponse } from "next/server";

/**
 * POST /api/agents/client/chat
 *
 * Protocol endpoint — registered as a DID document service endpoint.
 * Accepts a message and returns a placeholder response. Identity-gated
 * fulfillment (haiku exchange) is implemented in a later slice.
 *
 * Request body: { message: string }
 * Response body: { message: string }
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

	return NextResponse.json({
		message:
			"Identity verification required before chat fulfillment is available.",
	});
}
