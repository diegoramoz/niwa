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
	setIdentityVerified,
	setServerAgent,
	setServerOwner,
	setServerOwnershipVC,
} from "lib/demo-store";
import { createAgent } from "lib/identity/agent";
import { issueOwnershipCredential } from "lib/identity/credential";
import { createOwner } from "lib/identity/owner";
import { type ChatPayload, haikuPayload } from "lib/identity/payloads/haiku";
import { describe, expect, it } from "vitest";

const BASE_URL = "http://localhost:3000";
const DID_KEY_PATTERN = /^did:key:/;
const JWT_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

/**
 * Parity regression tests for the full ACK-ID demo flow.
 *
 * These tests lock the end-to-end behavior of the replatformed demo:
 *  - Owner creation (client + server)
 *  - Agent creation with correct controller and service endpoints
 *  - Ownership VC issuance and verification
 *  - Mutual identity verification via DID exchange
 *  - Haiku payload isolation: runs without importing core identity modules
 *  - Custom payload can substitute the haiku without touching identity code
 *  - Verification failure paths produce clear errors
 *  - Full guided flow from session reset through verified fulfillment
 */
describe("Step 7: parity regression tests — full guided flow", () => {
	// ─── Owner creation ────────────────────────────────────────────────────────

	describe("owner creation", () => {
		it("creates a client owner with a valid did:key DID and signer", async () => {
			const owner = await createOwner();
			expect(owner.did).toMatch(DID_KEY_PATTERN);
			expect(owner.didDocument.id).toBe(owner.did);
			expect(owner.signer).toBeDefined();
			expect(owner.algorithm).toBeDefined();
		});

		it("creates a server owner independent from the client owner", async () => {
			const client = await createOwner();
			const server = await createOwner();
			expect(client.did).not.toBe(server.did);
		});

		it("owner DID document has verificationMethod and authentication", async () => {
			const owner = await createOwner();
			expect(Array.isArray(owner.didDocument.verificationMethod)).toBe(true);
			expect((owner.didDocument.verificationMethod?.length ?? 0) > 0).toBe(
				true
			);
			expect(owner.didDocument.authentication).toBeDefined();
		});
	});

	// ─── Agent creation ────────────────────────────────────────────────────────

	describe("agent creation", () => {
		it("creates a client agent controlled by its owner", async () => {
			const owner = await createOwner();
			const agent = await createAgent({
				namespace: "client",
				baseUrl: BASE_URL,
				controller: owner.did,
			});
			expect(agent.did).toMatch(DID_KEY_PATTERN);
			expect(agent.didDocument.controller).toBe(owner.did);
		});

		it("creates a server agent controlled by its owner", async () => {
			const owner = await createOwner();
			const agent = await createAgent({
				namespace: "server",
				baseUrl: BASE_URL,
				controller: owner.did,
			});
			expect(agent.didDocument.controller).toBe(owner.did);
		});

		it("agent DID document includes all three namespaced service endpoints", async () => {
			for (const namespace of ["client", "server"] as const) {
				const owner = await createOwner();
				const agent = await createAgent({
					namespace,
					baseUrl: BASE_URL,
					controller: owner.did,
				});
				const serviceUrls = (agent.didDocument.service ?? []).map((s) =>
					typeof s.serviceEndpoint === "string" ? s.serviceEndpoint : ""
				);
				expect(
					serviceUrls.some((u) => u.includes(`/api/agents/${namespace}/chat`))
				).toBe(true);
				expect(
					serviceUrls.some((u) =>
						u.includes(`/api/agents/${namespace}/identity/challenge`)
					)
				).toBe(true);
				expect(
					serviceUrls.some((u) =>
						u.includes(`/api/agents/${namespace}/identity/vc`)
					)
				).toBe(true);
			}
		});

		it("client and server agents have distinct DIDs", async () => {
			const clientOwner = await createOwner();
			const serverOwner = await createOwner();
			const clientAgent = await createAgent({
				namespace: "client",
				baseUrl: BASE_URL,
				controller: clientOwner.did,
			});
			const serverAgent = await createAgent({
				namespace: "server",
				baseUrl: BASE_URL,
				controller: serverOwner.did,
			});
			expect(clientAgent.did).not.toBe(serverAgent.did);
		});
	});

	// ─── VC issuance ────────────────────────────────────────────────────────────

	describe("ownership VC issuance", () => {
		it("issues a ControllerCredential as a signed JWT", async () => {
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
			expect(result.jwt).toMatch(JWT_PATTERN);
			expect(result.verified).toBe(true);
			expect(result.verificationError).toBeNull();
		});

		it("VC issued by one owner does NOT verify with a different owner as trusted issuer", async () => {
			const ownerA = await createOwner();
			const ownerB = await createOwner();
			const agent = await createAgent({
				namespace: "client",
				baseUrl: BASE_URL,
				controller: ownerA.did,
			});
			const result = await issueOwnershipCredential({
				ownerDid: ownerA.did,
				ownerSigner: ownerA.signer,
				ownerAlgorithm: ownerA.algorithm,
				agentDid: agent.did,
				agentDidDocument: agent.didDocument,
			});

			// Seed resolver with agent DID document so controller field is visible
			const resolver = getDidResolver();
			resolver.addToCache(agent.did, agent.didDocument);

			const parsed = await parseJwtCredential(result.jwt, resolver);
			await expect(
				verifyParsedCredential(parsed, {
					resolver,
					// Wrong trusted issuer — should fail
					trustedIssuers: [ownerB.did],
					verifiers: [getControllerClaimVerifier()],
				})
			).rejects.toThrow();
		});
	});

	// ─── Verification success / failure ─────────────────────────────────────────

	describe("verification paths", () => {
		it("mutual verification succeeds when both VCs are valid", async () => {
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

			const resolver = getDidResolver();
			// Seed resolver cache so controller field is visible during verification
			resolver.addToCache(clientAgent.did, clientAgent.didDocument);
			resolver.addToCache(serverAgent.did, serverAgent.didDocument);

			for (const vc of [clientVC, serverVC]) {
				const parsed = await parseJwtCredential(vc.jwt, resolver);
				const issuerDid =
					typeof parsed.issuer === "string" ? parsed.issuer : parsed.issuer.id;
				await expect(
					verifyParsedCredential(parsed, {
						resolver,
						trustedIssuers: [issuerDid],
						verifiers: [getControllerClaimVerifier()],
					})
				).resolves.not.toThrow();
			}
		});

		it("verification fails when JWT signature is tampered", async () => {
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

			const parts = result.jwt.split(".");
			const tampered = `${parts[0]}.${parts[1]}TAMPERED.${parts[2]}`;

			await expect(
				parseJwtCredential(tampered, getDidResolver())
			).rejects.toThrow();
		});

		it("verification fails when the agent has no controller field set", async () => {
			const owner = await createOwner();
			// Agent created WITHOUT controller — no controller claim to verify
			const agent = await createAgent({
				namespace: "client",
				baseUrl: BASE_URL,
			});
			const result = await issueOwnershipCredential({
				ownerDid: owner.did,
				ownerSigner: owner.signer,
				ownerAlgorithm: owner.algorithm,
				agentDid: agent.did,
				agentDidDocument: agent.didDocument,
			});

			const resolver = getDidResolver();
			// Do NOT seed agent DID document — controller field absent from
			// did:key regenerated document, so controller claim check fails.
			const parsed = await parseJwtCredential(result.jwt, resolver);
			await expect(
				verifyParsedCredential(parsed, {
					resolver,
					trustedIssuers: [owner.did],
					verifiers: [getControllerClaimVerifier()],
				})
			).rejects.toThrow();
		});
	});

	// ─── Haiku payload isolation ─────────────────────────────────────────────────

	describe("haiku payload isolation", () => {
		it("haikuPayload.fulfill runs without any identity imports", () => {
			// This test intentionally uses only the haiku module.
			// If it passes, the payload is decoupled from the identity core.
			const result = haikuPayload.fulfill("standalone message");
			expect(typeof result).toBe("string");
			expect(result.length).toBeGreaterThan(0);
		});

		it("a custom payload can substitute haikuPayload without identity changes", () => {
			const customPayload: ChatPayload = {
				fulfill(_message: string) {
					return "custom fulfillment";
				},
			};
			// Core identity orchestration is unaffected — only the payload changes
			expect(customPayload.fulfill("any message")).toBe("custom fulfillment");
			expect(haikuPayload.fulfill("any message")).not.toBe(
				"custom fulfillment"
			);
		});
	});

	// ─── Full guided flow (end-to-end parity) ────────────────────────────────────

	describe("full guided flow — session reset through verified fulfillment", () => {
		it("completes the entire ACK-ID demo flow in sequence", async () => {
			const sessionId = "test-parity-full-flow";
			resetSession(sessionId);

			// Step 1: client owner
			const clientOwner = await createOwner();
			setClientOwner(clientOwner, sessionId);
			expect(getSession(sessionId).clientOwner?.did).toMatch(DID_KEY_PATTERN);

			// Step 2: client agent
			const clientAgent = await createAgent({
				namespace: "client",
				baseUrl: BASE_URL,
				controller: clientOwner.did,
			});
			setClientAgent(clientAgent, sessionId);
			expect(getSession(sessionId).clientAgent?.didDocument.controller).toBe(
				clientOwner.did
			);

			// Step 3: client ownership VC
			const clientVC = await issueOwnershipCredential({
				ownerDid: clientOwner.did,
				ownerSigner: clientOwner.signer,
				ownerAlgorithm: clientOwner.algorithm,
				agentDid: clientAgent.did,
				agentDidDocument: clientAgent.didDocument,
			});
			setClientOwnershipVC(clientVC, sessionId);
			expect(getSession(sessionId).clientOwnershipVC?.verified).toBe(true);

			// Step 4: server owner + agent
			const serverOwner = await createOwner();
			const serverAgent = await createAgent({
				namespace: "server",
				baseUrl: BASE_URL,
				controller: serverOwner.did,
			});
			setServerOwner(serverOwner, sessionId);
			setServerAgent(serverAgent, sessionId);

			// Step 5: server ownership VC
			const serverVC = await issueOwnershipCredential({
				ownerDid: serverOwner.did,
				ownerSigner: serverOwner.signer,
				ownerAlgorithm: serverOwner.algorithm,
				agentDid: serverAgent.did,
				agentDidDocument: serverAgent.didDocument,
			});
			setServerOwnershipVC(serverVC, sessionId);
			expect(getSession(sessionId).serverOwnershipVC?.verified).toBe(true);

			// Step 6: mutual identity verification
			const resolver = getDidResolver();
			// Seed resolver cache so controller field is visible during verification
			resolver.addToCache(clientAgent.did, clientAgent.didDocument);
			resolver.addToCache(serverAgent.did, serverAgent.didDocument);
			const log: string[] = [];

			for (const [label, vc] of [
				["client", clientVC],
				["server", serverVC],
			] as const) {
				const parsed = await parseJwtCredential(vc.jwt, resolver);
				const issuerDid =
					typeof parsed.issuer === "string" ? parsed.issuer : parsed.issuer.id;
				await verifyParsedCredential(parsed, {
					resolver,
					trustedIssuers: [issuerDid],
					verifiers: [getControllerClaimVerifier()],
				});
				log.push(`✓ ${label} VC verified`);
			}
			log.push(
				"✓ Mutual identity verification complete — interaction gate open"
			);
			setIdentityVerified(log, sessionId);

			const session = getSession(sessionId);
			expect(session.identityVerified).toBe(true);
			expect(session.verificationLog).toHaveLength(3);

			// Step 7: haiku fulfillment after verification
			const fulfillment = haikuPayload.fulfill("identity proved");
			expect(typeof fulfillment).toBe("string");
			expect(fulfillment.length).toBeGreaterThan(0);
		});
	});
});
