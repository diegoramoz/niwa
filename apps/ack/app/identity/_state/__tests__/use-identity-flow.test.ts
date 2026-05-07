import { describe, expect, it } from "vitest";
import { createInitialIdentityFlowState } from "../identity-flow.types";
import { deriveIdentityFlowView } from "../use-identity-flow";

describe("use-identity-flow view derivation", () => {
	it("derives visibility and loading flags from state", () => {
		const initial = createInitialIdentityFlowState();
		const state = {
			...initial,
			setup: {
				...initial.setup,
				clientVc: { jwt: "a.b.c", verified: true, verificationError: null },
				serverVc: { jwt: "x.y.z", verified: true, verificationError: null },
			},
			requests: {
				...initial.requests,
				createServerOwner: { status: "loading" as const },
			},
		};

		const view = deriveIdentityFlowView(state);

		expect(view.showServerSetup).toBe(true);
		expect(view.showInteractionGate).toBe(true);
		expect(view.createServerOwnerLoading).toBe(true);
		expect(view.anyLoading).toBe(true);
	});

	it("reports no loading when every operation is idle", () => {
		const view = deriveIdentityFlowView(createInitialIdentityFlowState());
		expect(view.anyLoading).toBe(false);
		expect(view.sendChatLoading).toBe(false);
		expect(view.verifyIdentityLoading).toBe(false);
	});
});
