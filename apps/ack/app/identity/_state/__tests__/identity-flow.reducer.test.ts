import { describe, expect, it } from "vitest";
import { identityFlowReducer } from "../identity-flow.reducer";
import { createInitialIdentityFlowState } from "../identity-flow.types";

const ownerArtifact = {
	did: "did:key:owner",
	didDocument: { id: "did:key:owner" },
} as const;

const agentArtifact = {
	did: "did:key:agent",
	didDocument: { id: "did:key:agent" },
} as const;

const vcArtifact = {
	jwt: "a.b.c",
	verified: true,
	verificationError: null,
} as const;

describe("identity flow reducer", () => {
	it("applies client owner cascade and clears downstream setup and interaction", () => {
		const initial = createInitialIdentityFlowState();
		const hydrated = {
			...initial,
			setup: {
				clientOwner: ownerArtifact,
				clientAgent: agentArtifact,
				clientVc: vcArtifact,
				serverOwner: ownerArtifact,
				serverAgent: agentArtifact,
				serverVc: vcArtifact,
			},
			interaction: {
				...initial.interaction,
				blockedResult: { blocked: true, reason: "blocked" },
				verifyResult: { verified: true, log: ["ok"] },
				chatResult: { message: "hello", blocked: false },
			},
		};

		const next = identityFlowReducer(hydrated, {
			type: "APPLY_CASCADE",
			cascade: "clientOwner",
		});

		expect(next.setup.clientOwner).toBeNull();
		expect(next.setup.clientAgent).toBeNull();
		expect(next.setup.clientVc).toBeNull();
		expect(next.setup.serverOwner).toBeNull();
		expect(next.setup.serverAgent).toBeNull();
		expect(next.setup.serverVc).toBeNull();
		expect(next.interaction.blockedResult).toBeNull();
		expect(next.interaction.verifyResult).toBeNull();
		expect(next.interaction.chatResult).toBeNull();
	});

	it("tracks operation loading and failure states", () => {
		const initial = createInitialIdentityFlowState();
		const loading = identityFlowReducer(initial, {
			type: "OPERATION_STARTED",
			operation: "verifyIdentity",
		});
		expect(loading.requests.verifyIdentity.status).toBe("loading");

		const failed = identityFlowReducer(loading, {
			type: "OPERATION_FAILED",
			operation: "verifyIdentity",
			error: "boom",
		});
		expect(failed.requests.verifyIdentity).toEqual({
			status: "error",
			error: "boom",
		});
	});

	it("clears interaction state when server VC is reset", () => {
		const initial = createInitialIdentityFlowState();
		const state = {
			...initial,
			setup: {
				...initial.setup,
				serverVc: vcArtifact,
			},
			interaction: {
				...initial.interaction,
				blockedResult: { blocked: true, reason: "x" },
				verifyResult: { verified: true, log: ["ok"] },
				chatResult: { blocked: false, haiku: "line" },
			},
		};

		const next = identityFlowReducer(state, {
			type: "APPLY_CASCADE",
			cascade: "serverVc",
		});

		expect(next.setup.serverVc).toBeNull();
		expect(next.interaction.blockedResult).toBeNull();
		expect(next.interaction.verifyResult).toBeNull();
		expect(next.interaction.chatResult).toBeNull();
	});
});
