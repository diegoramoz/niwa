import {
	getControllerClaimVerifier,
	getDidResolver,
	parseJwtCredential,
	verifyParsedCredential,
} from "agentcommercekit";
import {
	getSession,
	resetSession,
	setClientAgent,
	setClientOwner,
	setClientOwnershipVC,
	setServerAgent,
	setServerOwner,
	setServerOwnershipVC,
} from "lib/demo-store";
import { createAgent } from "lib/identity/agent";
import { issueOwnershipCredential } from "lib/identity/credential";
import { createOwner } from "lib/identity/owner";
import { describe, expect, it } from "vitest";

const BASE_URL = "http://localhost:3000";
const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

/**
 * App-level integration test for Step 5 — Server ownership VC issuance and
 * protocol route surfaces.
 *
 * Verifies that:
 *  1. A server ownership VC can be issued and returned as a signed JWT.
 *  2. The issued JWT passes verification with the issuing server owner as trusted.
 *  3. The server ownership VC is stored in the demo session and retrievable.
 *  4. The identity/challenge endpoint logic correctly verifies an incoming VC.
 *  5. Both client and server VCs are present in the session after full setup.
 */
describe("Step 5: server ownership VC issuance and protocol route surfaces", () => {
	it("issues a server ControllerCredential as a signed JWT string", async () => {
		const serverOwner = await createOwner();
		const serverAgent = await createAgent({
			namespace: "server",
			baseUrl: BASE_URL,
			controller: serverOwner.did,
		});

		const result = await issueOwnershipCredential({
			ownerDid: serverOwner.did,
			ownerSigner: serverOwner.signer,
			ownerAlgorithm: serverOwner.algorithm,
			agentDid: serverAgent.did,
			agentDidDocument: serverAgent.didDocument,
		});

		expect(result.jwt).toMatch(JWT_PATTERN);
		expect(result.verified).toBe(true);
		expect(result.verificationError).toBeNull();
	});

	it("server ownership VC verifies with the server owner as trusted issuer", async () => {
		const serverOwner = await createOwner();
		const serverAgent = await createAgent({
			namespace: "server",
			baseUrl: BASE_URL,
			controller: serverOwner.did,
		});

		const result = await issueOwnershipCredential({
			ownerDid: serverOwner.did,
			ownerSigner: serverOwner.signer,
			ownerAlgorithm: serverOwner.algorithm,
			agentDid: serverAgent.did,
			agentDidDocument: serverAgent.didDocument,
		});

		const resolver = getDidResolver();
		resolver.addToCache(serverAgent.did, serverAgent.didDocument);

		const parsed = await parseJwtCredential(result.jwt, resolver);
		await expect(
			verifyParsedCredential(parsed, {
				resolver,
				trustedIssuers: [serverOwner.did],
				verifiers: [getControllerClaimVerifier()],
			})
		).resolves.not.toThrow();
	});

	it("stores server ownership VC in the demo session", async () => {
		resetSession("test-server-vc-session");

		const serverOwner = await createOwner();
		const serverAgent = await createAgent({
			namespace: "server",
			baseUrl: BASE_URL,
			controller: serverOwner.did,
		});
		const serverVC = await issueOwnershipCredential({
			ownerDid: serverOwner.did,
			ownerSigner: serverOwner.signer,
			ownerAlgorithm: serverOwner.algorithm,
			agentDid: serverAgent.did,
			agentDidDocument: serverAgent.didDocument,
		});

		setServerOwner(serverOwner, "test-server-vc-session");
		setServerAgent(serverAgent, "test-server-vc-session");
		setServerOwnershipVC(serverVC, "test-server-vc-session");

		const session = getSession("test-server-vc-session");

		expect(session.serverOwnershipVC).not.toBeNull();
		expect(session.serverOwnershipVC?.jwt).toBe(serverVC.jwt);
		expect(session.serverOwnershipVC?.verified).toBe(true);
	});

	it("identity/challenge logic verifies an incoming VC and extracts issuer", async () => {
		// Simulate what the challenge endpoint does: parse the incoming VC,
		// extract the issuer, and verify with that issuer as trusted.
		const callerOwner = await createOwner();
		const callerAgent = await createAgent({
			namespace: "client",
			baseUrl: BASE_URL,
			controller: callerOwner.did,
		});
		const callerVC = await issueOwnershipCredential({
			ownerDid: callerOwner.did,
			ownerSigner: callerOwner.signer,
			ownerAlgorithm: callerOwner.algorithm,
			agentDid: callerAgent.did,
			agentDidDocument: callerAgent.didDocument,
		});

		const resolver = getDidResolver();
		resolver.addToCache(callerAgent.did, callerAgent.didDocument);

		const parsed = await parseJwtCredential(callerVC.jwt, resolver);
		const issuerDid =
			typeof parsed.issuer === "string" ? parsed.issuer : parsed.issuer.id;

		// Issuer extracted from the VC should equal the caller's owner DID
		expect(issuerDid).toBe(callerOwner.did);

		await expect(
			verifyParsedCredential(parsed, {
				resolver,
				trustedIssuers: [issuerDid],
				verifiers: [getControllerClaimVerifier()],
			})
		).resolves.not.toThrow();
	});

	it("full session has both client and server ownership VCs after complete setup", async () => {
		resetSession("test-full-vc-session");

		// Client side
		const clientOwner = await createOwner();
		const clientAgent = await createAgent({
			namespace: "client",
			baseUrl: BASE_URL,
			controller: clientOwner.did,
		});
		const clientVC = await issueOwnershipCredential({
			ownerDid: clientOwner.did,
			ownerSigner: clientOwner.signer,
			ownerAlgorithm: clientOwner.algorithm,
			agentDid: clientAgent.did,
			agentDidDocument: clientAgent.didDocument,
		});

		setClientOwner(clientOwner, "test-full-vc-session");
		setClientAgent(clientAgent, "test-full-vc-session");
		setClientOwnershipVC(clientVC, "test-full-vc-session");

		// Server side
		const serverOwner = await createOwner();
		const serverAgent = await createAgent({
			namespace: "server",
			baseUrl: BASE_URL,
			controller: serverOwner.did,
		});
		const serverVC = await issueOwnershipCredential({
			ownerDid: serverOwner.did,
			ownerSigner: serverOwner.signer,
			ownerAlgorithm: serverOwner.algorithm,
			agentDid: serverAgent.did,
			agentDidDocument: serverAgent.didDocument,
		});

		setServerOwner(serverOwner, "test-full-vc-session");
		setServerAgent(serverAgent, "test-full-vc-session");
		setServerOwnershipVC(serverVC, "test-full-vc-session");

		const session = getSession("test-full-vc-session");

		expect(session.clientOwnershipVC).not.toBeNull();
		expect(session.clientOwnershipVC?.verified).toBe(true);
		expect(session.serverOwnershipVC).not.toBeNull();
		expect(session.serverOwnershipVC?.verified).toBe(true);

		// VCs belong to different agents
		expect(session.clientOwnershipVC?.jwt).not.toBe(
			session.serverOwnershipVC?.jwt
		);
	});
});
