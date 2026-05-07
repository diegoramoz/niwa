import {
	getSession,
	resetSession,
	setClientAgent,
	setClientOwner,
	setClientOwnershipVC,
} from "lib/demo-store";
import { createAgent } from "lib/identity/agent";
import { issueOwnershipCredential } from "lib/identity/credential";
import { createOwner } from "lib/identity/owner";
import { describe, expect, it } from "vitest";

const BASE_URL = "http://localhost:3000";
const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

/**
 * App-level integration test for Step 3 — Client ownership VC issuance and
 * verification.
 *
 * Verifies that:
 *  1. A ControllerCredential can be issued and is returned as a signed JWT.
 *  2. The issued JWT passes verification with the issuing owner as trusted.
 *  3. The credential is stored in the demo session and retrievable.
 *  4. Step 3 requires both owner (step 01) and agent (step 02) to exist.
 */
describe("Step 3: client ownership VC issuance and verification", () => {
	it("issues a ControllerCredential as a signed JWT string", async () => {
		const owner = await createOwner();
		const agent = await createAgent({
			namespace: "client",
			baseUrl: BASE_URL,
			controller: owner.did,
		});

		const result = await issueOwnershipCredential({
			ownerDid: owner.did,
			ownerSigner: owner.signer,
			ownerAlgorithm: owner.algorithm,
			agentDid: agent.did,
			agentDidDocument: agent.didDocument,
		});

		expect(result.jwt).toBeDefined();
		expect(result.jwt).toMatch(JWT_PATTERN);
	});

	it("verification succeeds with the issuing owner as trusted issuer", async () => {
		const owner = await createOwner();
		const agent = await createAgent({
			namespace: "client",
			baseUrl: BASE_URL,
			controller: owner.did,
		});

		const result = await issueOwnershipCredential({
			ownerDid: owner.did,
			ownerSigner: owner.signer,
			ownerAlgorithm: owner.algorithm,
			agentDid: agent.did,
			agentDidDocument: agent.didDocument,
		});

		expect(result.verified).toBe(true);
		expect(result.verificationError).toBeNull();
	});

	it("credential subject is the agent DID and issuer is the owner DID", async () => {
		const owner = await createOwner();
		const agent = await createAgent({
			namespace: "client",
			baseUrl: BASE_URL,
			controller: owner.did,
		});

		const result = await issueOwnershipCredential({
			ownerDid: owner.did,
			ownerSigner: owner.signer,
			ownerAlgorithm: owner.algorithm,
			agentDid: agent.did,
			agentDidDocument: agent.didDocument,
		});

		// Decode the JWT payload without verifying signature to inspect claims
		const payloadBase64 = result.jwt.split(".")[1];
		const payload = JSON.parse(
			Buffer.from(payloadBase64, "base64url").toString("utf-8")
		) as {
			iss: string;
			sub: string;
			vc?: { type?: string[] };
		};

		expect(payload.iss).toBe(owner.did);
		expect(payload.sub).toBe(agent.did);
		expect(payload.vc?.type).toContain("ControllerCredential");
	});

	it("stores the VC result in the demo session and returns it via getSession", async () => {
		resetSession("test-vc-session");

		const owner = await createOwner();
		const agent = await createAgent({
			namespace: "client",
			baseUrl: BASE_URL,
			controller: owner.did,
		});

		setClientOwner(owner, "test-vc-session");
		setClientAgent(agent, "test-vc-session");

		const result = await issueOwnershipCredential({
			ownerDid: owner.did,
			ownerSigner: owner.signer,
			ownerAlgorithm: owner.algorithm,
			agentDid: agent.did,
			agentDidDocument: agent.didDocument,
		});

		setClientOwnershipVC(result, "test-vc-session");

		const session = getSession("test-vc-session");

		expect(session.clientOwnershipVC).not.toBeNull();
		expect(session.clientOwnershipVC?.jwt).toBe(result.jwt);
		expect(session.clientOwnershipVC?.verified).toBe(true);
	});

	it("step 3 is executable after steps 1 and 2 — full sequential flow", async () => {
		resetSession("test-full-vc-flow");

		const owner = await createOwner();
		setClientOwner(owner, "test-full-vc-flow");

		const agent = await createAgent({
			namespace: "client",
			baseUrl: BASE_URL,
			controller: owner.did,
		});
		setClientAgent(agent, "test-full-vc-flow");

		const session = getSession("test-full-vc-flow");

		expect(session.clientOwner).not.toBeNull();
		expect(session.clientAgent).not.toBeNull();

		// Both are asserted non-null above; use local refs to avoid lint errors.
		const clientOwner = session.clientOwner;
		const clientAgent = session.clientAgent;

		if (!clientOwner) {
			return;
		}
		if (!clientAgent) {
			return;
		}

		const result = await issueOwnershipCredential({
			ownerDid: clientOwner.did,
			ownerSigner: clientOwner.signer,
			ownerAlgorithm: clientOwner.algorithm,
			agentDid: clientAgent.did,
			agentDidDocument: clientAgent.didDocument,
		});

		setClientOwnershipVC(result, "test-full-vc-flow");

		const updatedSession = getSession("test-full-vc-flow");

		expect(updatedSession.clientOwnershipVC?.verified).toBe(true);
	});
});
