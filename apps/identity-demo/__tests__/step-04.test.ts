import {
	getSession,
	resetSession,
	setClientAgent,
	setClientOwner,
	setClientOwnershipVC,
	setServerAgent,
	setServerOwner,
} from "lib/demo-store";
import { createAgent } from "lib/identity/agent";
import { issueOwnershipCredential } from "lib/identity/credential";
import { createOwner } from "lib/identity/owner";
import { describe, expect, it } from "vitest";

const BASE_URL = "http://localhost:3000";
const DID_KEY_PATTERN = /^did:key:/;

/**
 * App-level integration test for Step 4 — Server owner and agent setup.
 *
 * Verifies that:
 *  1. A server owner can be created with a valid DID and DID document.
 *  2. A server agent can be created and is controlled by the server owner.
 *  3. Both server identities are stored in the demo session and retrievable.
 *  4. Server agent DID document includes the expected namespaced service
 *     endpoints under /api/agents/server/.
 *  5. Both client and server identities are present in the session before
 *     interaction can begin (parity gate).
 */
describe("Step 4: server owner and agent setup", () => {
	it("generates a server owner with a valid did:key DID", async () => {
		const serverOwner = await createOwner();

		expect(serverOwner.did).toMatch(DID_KEY_PATTERN);
		expect(serverOwner.didDocument.id).toBe(serverOwner.did);
		expect(serverOwner.signer).toBeDefined();
		expect(serverOwner.algorithm).toBeDefined();
	});

	it("server owner DID is independent from client owner DID", async () => {
		const clientOwner = await createOwner();
		const serverOwner = await createOwner();

		expect(clientOwner.did).not.toBe(serverOwner.did);
		expect(clientOwner.didDocument.id).not.toBe(serverOwner.didDocument.id);
	});

	it("creates a server agent controlled by the server owner", async () => {
		const serverOwner = await createOwner();
		const serverAgent = await createAgent({
			namespace: "server",
			baseUrl: BASE_URL,
			controller: serverOwner.did,
		});

		expect(serverAgent.did).toMatch(DID_KEY_PATTERN);
		expect(serverAgent.didDocument.id).toBe(serverAgent.did);
		expect(serverAgent.didDocument.controller).toBe(serverOwner.did);
	});

	it("server agent DID document includes namespaced service endpoints", async () => {
		const serverOwner = await createOwner();
		const serverAgent = await createAgent({
			namespace: "server",
			baseUrl: BASE_URL,
			controller: serverOwner.did,
		});

		const services = serverAgent.didDocument.service ?? [];
		const serviceUrls = services.map((s) =>
			typeof s.serviceEndpoint === "string" ? s.serviceEndpoint : ""
		);

		expect(
			serviceUrls.some((url) =>
				url.includes("/api/agents/server/identity/challenge")
			)
		).toBe(true);
		expect(
			serviceUrls.some((url) => url.includes("/api/agents/server/identity/vc"))
		).toBe(true);
	});

	it("stores server owner and agent in the demo session", async () => {
		resetSession("test-server-session");

		const serverOwner = await createOwner();
		const serverAgent = await createAgent({
			namespace: "server",
			baseUrl: BASE_URL,
			controller: serverOwner.did,
		});

		setServerOwner(serverOwner, "test-server-session");
		setServerAgent(serverAgent, "test-server-session");

		const session = getSession("test-server-session");

		expect(session.serverOwner).not.toBeNull();
		expect(session.serverOwner?.did).toBe(serverOwner.did);
		expect(session.serverAgent).not.toBeNull();
		expect(session.serverAgent?.did).toBe(serverAgent.did);
	});

	it("both client and server identities are visible in the session before interaction", async () => {
		resetSession("test-full-setup-session");

		// Client side setup
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

		setClientOwner(clientOwner, "test-full-setup-session");
		setClientAgent(clientAgent, "test-full-setup-session");
		setClientOwnershipVC(clientVC, "test-full-setup-session");

		// Server side setup
		const serverOwner = await createOwner();
		const serverAgent = await createAgent({
			namespace: "server",
			baseUrl: BASE_URL,
			controller: serverOwner.did,
		});

		setServerOwner(serverOwner, "test-full-setup-session");
		setServerAgent(serverAgent, "test-full-setup-session");

		const session = getSession("test-full-setup-session");

		// All five identities exist and are visible before interaction starts
		expect(session.clientOwner).not.toBeNull();
		expect(session.clientAgent).not.toBeNull();
		expect(session.clientOwnershipVC).not.toBeNull();
		expect(session.serverOwner).not.toBeNull();
		expect(session.serverAgent).not.toBeNull();

		// Client and server DIDs are distinct
		expect(session.clientOwner?.did).not.toBe(session.serverOwner?.did);
		expect(session.clientAgent?.did).not.toBe(session.serverAgent?.did);
	});
});
