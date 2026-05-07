"use client";

import { useMemo } from "react";
import { useIdentityFlowContext } from "./identity-flow.provider";
import type {
	IdentityFlowState,
	IdentityOperation,
} from "./identity-flow.types";

function isLoading(
	state: IdentityFlowState,
	operation: IdentityOperation
): boolean {
	return state.requests[operation].status === "loading";
}

export function deriveIdentityFlowView(state: IdentityFlowState) {
	const anyLoading = (
		Object.values(state.requests) as Array<{ status: string }>
	).some((request) => request.status === "loading");

	return {
		setup: state.setup,
		interaction: state.interaction,
		requests: state.requests,
		anyLoading,
		createClientOwnerLoading: isLoading(state, "createClientOwner"),
		createClientAgentLoading: isLoading(state, "createClientAgent"),
		issueClientVcLoading: isLoading(state, "issueClientVc"),
		createServerOwnerLoading: isLoading(state, "createServerOwner"),
		createServerAgentLoading: isLoading(state, "createServerAgent"),
		issueServerVcLoading: isLoading(state, "issueServerVc"),
		attemptBlockedChatLoading: isLoading(state, "attemptBlockedChat"),
		verifyIdentityLoading: isLoading(state, "verifyIdentity"),
		sendChatLoading: isLoading(state, "sendChat"),
		showServerSetup: !!state.setup.clientVc,
		showInteractionGate: !!state.setup.serverVc,
	};
}

export function useIdentityFlow() {
	const { state, commands } = useIdentityFlowContext();
	const view = useMemo(() => deriveIdentityFlowView(state), [state]);

	return {
		...view,
		...commands,
	};
}
