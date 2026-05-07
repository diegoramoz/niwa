/**
 * Haiku payload — demo payload that fulfills a chat request with a haiku.
 *
 * This module is intentionally isolated from core identity orchestration.
 * The identity package does not depend on it; the server chat route wires it
 * in as the default demo payload.
 */

export type ChatPayload = {
	/**
	 * Produce a fulfillment response for the given message.
	 * Called only after identity verification has succeeded.
	 */
	fulfill(message: string): string;
};

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

export const haikuPayload: ChatPayload = {
	fulfill(message: string): string {
		return pickHaiku(message);
	},
};
