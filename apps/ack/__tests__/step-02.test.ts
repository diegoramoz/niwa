import {
	getSession,
	resetSession,
	setClientAgent,
	setClientOwner,
} from "lib/demo-store";
import { createAgent } from "lib/identity/agent";
import { createOwner } from "lib/identity/owner";
import { describe, expect, it } from "vitest";

const DID_KEY_PATTERN = /^did:key:/;
const BASE_URL = "http://localhost:3000";
const NO_BARE_PORT = /:\d{4,5}\/(?!api)/;

/**
 * App-level integration test for Step 2 — Client Agent creation.
 *
 * Verifies that:
 *  1. An agent can be created with a valid DID and DID document.
 *  2. The DID document contains service endpoints that resolve to the
 *     namespaced app-router paths for the client namespace.
 *  3. The agent is stored in the demo session and retrievable.
 *  4. Step 2 is executable after step 1 (owner must exist first).
 */
describe("Step 2: client agent creation", () => {
	it("generates an agent with a valid did:key DID", async () => {
		const agent = await createAgent({ namespace: "client", baseUrl: BASE_URL });

		expect(agent.did).toMatch(DID_KEY_PATTERN);
		expect(agent.didDocument.id).toBe(agent.did);
		expect(agent.signer).toBeDefined();
		expect(agent.algorithm).toBeDefined();
	});

	it("produces a DID document with verificationMethod and authentication", async () => {
		const agent = await createAgent({ namespace: "client", baseUrl: BASE_URL });
		const { didDocument } = agent;

		expect(didDocument["@context"]).toBeDefined();
		expect(Array.isArray(didDocument.verificationMethod)).toBe(true);
		expect((didDocument.verificationMethod?.length ?? 0) > 0).toBe(true);
		expect(didDocument.authentication).toBeDefined();
	});

	it("DID document service endpoints resolve to namespaced app-router paths", async () => {
		const agent = await createAgent({ namespace: "client", baseUrl: BASE_URL });
		const services = agent.didDocument.service ?? [];

		const serviceEndpoints = services.map((s) =>
			typeof s.serviceEndpoint === "string" ? s.serviceEndpoint : ""
		);

		expect(
			serviceEndpoints.some((ep) => ep.includes("/api/agents/client/chat"))
		).toBe(true);

		expect(
			serviceEndpoints.some((ep) =>
				ep.includes("/api/agents/client/identity/challenge")
			)
		).toBe(true);

		expect(
			serviceEndpoints.some((ep) =>
				ep.includes("/api/agents/client/identity/vc")
			)
		).toBe(true);
	});

	it("service endpoints do not reference localhost ports (no port-based routing)", async () => {
		const agent = await createAgent({ namespace: "client", baseUrl: BASE_URL });
		const services = agent.didDocument.service ?? [];

		for (const s of services) {
			const ep = typeof s.serviceEndpoint === "string" ? s.serviceEndpoint : "";
			// Should not contain patterns like :5678 or :5679 — the original CLI ports
			expect(ep).not.toMatch(NO_BARE_PORT);
		}
	});

	it("stores the agent in the demo session and returns it via getSession", async () => {
		resetSession("test-agent-session");

		const owner = await createOwner();
		setClientOwner(owner, "test-agent-session");

		const agent = await createAgent({ namespace: "client", baseUrl: BASE_URL });
		setClientAgent(agent, "test-agent-session");

		const session = getSession("test-agent-session");

		expect(session.clientAgent).not.toBeNull();
		expect(session.clientAgent?.did).toBe(agent.did);
		expect(session.clientAgent?.didDocument.id).toBe(agent.did);
	});

	it("step 2 is executable after step 1 — session holds both owner and agent", async () => {
		resetSession("test-full-flow");

		const owner = await createOwner();
		setClientOwner(owner, "test-full-flow");

		const agent = await createAgent({ namespace: "client", baseUrl: BASE_URL });
		setClientAgent(agent, "test-full-flow");

		const session = getSession("test-full-flow");

		expect(session.clientOwner).not.toBeNull();
		expect(session.clientAgent).not.toBeNull();
		expect(session.clientOwner?.did).not.toBe(session.clientAgent?.did);
	});
});
