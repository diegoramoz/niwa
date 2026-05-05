import { describe, expect, it } from "vitest";
import { getSession, resetSession, setClientOwner } from "@/lib/demo-store";
import { createOwner } from "@/lib/identity/owner";

const DID_KEY_PATTERN = /^did:key:/;

/**
 * App-level integration test for Step 1 — Client Owner creation.
 *
 * Verifies that:
 *  1. An owner can be generated with a valid DID and DID document.
 *  2. The owner is stored in the demo session and retrievable.
 *  3. The DID document contains the expected W3C DID properties.
 */
describe("Step 1: client owner creation", () => {
	it("generates an owner with a valid did:key DID", async () => {
		const owner = await createOwner();

		expect(owner.did).toMatch(DID_KEY_PATTERN);
		expect(owner.didDocument.id).toBe(owner.did);
		expect(owner.signer).toBeDefined();
		expect(owner.algorithm).toBeDefined();
	});

	it("stores the owner in the demo session and returns it via getSession", async () => {
		resetSession("test-session");

		const owner = await createOwner();
		setClientOwner(owner, "test-session");

		const session = getSession("test-session");

		expect(session.clientOwner).not.toBeNull();
		expect(session.clientOwner?.did).toBe(owner.did);
		expect(session.clientOwner?.didDocument.id).toBe(owner.did);
	});

	it("produces a DID document with verificationMethod and authentication", async () => {
		const owner = await createOwner();
		const { didDocument } = owner;

		expect(didDocument["@context"]).toBeDefined();
		expect(Array.isArray(didDocument.verificationMethod)).toBe(true);
		expect((didDocument.verificationMethod?.length ?? 0) > 0).toBe(true);
		expect(didDocument.authentication).toBeDefined();
	});
});
