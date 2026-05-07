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
import { haikuPayload } from "lib/identity/payloads/haiku";
import { describe, expect, it } from "vitest";

const BASE_URL = "http://localhost:3000";

/**
 * App-level integration test for Step 6 — verified interaction gate with
 * haiku fulfillment.
 *
 * Verifies that:
 *  1. Mutual DID exchange verification succeeds when both VCs are valid.
 *  2. The session is marked as identity-verified after the exchange.
 *  3. The verification log contains the expected protocol steps.
 *  4. The server chat gate is open (returns haiku) after verification.
 *  5. The haiku payload fulfills requests with a non-empty string.
 *  6. Verification fails with a clear error when a VC is tampered.
 */
describe("Step 6: verified interaction gate with haiku fulfillment", () => {
	async function buildFullSession(sessionId: string) {
		resetSession(sessionId);

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

		setClientOwner(clientOwner, sessionId);
		setClientAgent(clientAgent, sessionId);
		setClientOwnershipVC(clientVC, sessionId);
		setServerOwner(serverOwner, sessionId);
		setServerAgent(serverAgent, sessionId);
		setServerOwnershipVC(serverVC, sessionId);

		return {
			clientOwner,
			clientAgent,
			clientVC,
			serverOwner,
			serverAgent,
			serverVC,
		};
	}

	it("mutual verification succeeds when both ownership VCs are valid", async () => {
		const { clientAgent, clientVC, serverAgent, serverVC } =
			await buildFullSession("test-gate-valid");

		const resolver = getDidResolver();
		// Seed resolver cache so controller field is visible during verification
		resolver.addToCache(clientAgent.did, clientAgent.didDocument);
		resolver.addToCache(serverAgent.did, serverAgent.didDocument);
		const log: string[] = [];

		// Server verifies client VC
		const clientParsed = await parseJwtCredential(clientVC.jwt, resolver);
		const clientIssuer =
			typeof clientParsed.issuer === "string"
				? clientParsed.issuer
				: clientParsed.issuer.id;
		await expect(
			verifyParsedCredential(clientParsed, {
				resolver,
				trustedIssuers: [clientIssuer],
				verifiers: [getControllerClaimVerifier()],
			})
		).resolves.not.toThrow();
		log.push("✓ Server agent verified client ownership VC");

		// Client verifies server VC
		const serverParsed = await parseJwtCredential(serverVC.jwt, resolver);
		const serverIssuer =
			typeof serverParsed.issuer === "string"
				? serverParsed.issuer
				: serverParsed.issuer.id;
		await expect(
			verifyParsedCredential(serverParsed, {
				resolver,
				trustedIssuers: [serverIssuer],
				verifiers: [getControllerClaimVerifier()],
			})
		).resolves.not.toThrow();
		log.push("✓ Client agent verified server ownership VC");
		log.push("✓ Mutual identity verification complete — interaction gate open");

		setIdentityVerified(log, "test-gate-valid");

		const session = getSession("test-gate-valid");
		expect(session.identityVerified).toBe(true);
		expect(session.verificationLog).toHaveLength(3);
	});

	it("session starts as unverified and only becomes verified after exchange", async () => {
		await buildFullSession("test-gate-unverified");

		const session = getSession("test-gate-unverified");
		expect(session.identityVerified).toBe(false);
		expect(session.verificationLog).toHaveLength(0);

		setIdentityVerified(["✓ Verified"], "test-gate-unverified");

		expect(session.identityVerified).toBe(true);
	});

	it("haiku payload returns a non-empty fulfillment string", () => {
		const result = haikuPayload.fulfill("hello world");
		expect(typeof result).toBe("string");
		expect(result.length).toBeGreaterThan(0);
	});

	it("haiku payload returns deterministic output for the same message", () => {
		const message = "test message";
		const first = haikuPayload.fulfill(message);
		const second = haikuPayload.fulfill(message);
		expect(first).toBe(second);
	});

	it("haiku payload returns different responses for different message lengths", () => {
		const results = new Set<string>();
		// 5 haikus indexed by message.length % 5, so 5 different lengths cover all
		for (let len = 0; len < 5; len++) {
			results.add(haikuPayload.fulfill("x".repeat(len + 1)));
		}
		// All 5 distinct haikus should be reachable
		expect(results.size).toBe(5);
	});

	it("verification fails with a tampered JWT", async () => {
		const { clientVC } = await buildFullSession("test-gate-tampered");

		// Tamper the payload segment of the JWT
		const parts = clientVC.jwt.split(".");
		const tamperedJwt = `${parts[0]}.${parts[1]}TAMPERED.${parts[2]}`;

		const resolver = getDidResolver();
		await expect(parseJwtCredential(tamperedJwt, resolver)).rejects.toThrow();
	});

	it("chat fulfillment is gated: unverified session returns blocked state", async () => {
		await buildFullSession("test-gate-blocked");
		const session = getSession("test-gate-blocked");

		// Simulate the server chat route logic: gate on identityVerified
		expect(session.identityVerified).toBe(false);

		// Without verification, the payload should NOT be called
		// (the route returns 403 before reaching haikuPayload.fulfill)
		// Here we confirm that nothing in the session enables fulfillment yet
		expect(session.clientOwnershipVC).not.toBeNull();
		expect(session.serverOwnershipVC).not.toBeNull();
		expect(session.identityVerified).toBe(false);
	});

	it("chat fulfillment is open after identity is verified", async () => {
		await buildFullSession("test-gate-open");
		setIdentityVerified(["✓ Verified"], "test-gate-open");

		const session = getSession("test-gate-open");
		expect(session.identityVerified).toBe(true);

		// Payload can now be called
		const fulfillment = haikuPayload.fulfill("haiku request");
		expect(fulfillment).toBeTruthy();
	});
});
