"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useReducer } from "react";
import type {
	ChatResult,
	IdentityArtifacts,
	VcArtifacts,
	VerifyResult,
} from "../types";
import { identityFlowReducer } from "./identity-flow.reducer";
import {
	createInitialIdentityFlowState,
	type IdentityCascade,
	type IdentityFlowState,
	type IdentityOperation,
} from "./identity-flow.types";

type IdentityFlowCommands = {
	setChatMessage: (message: string) => void;
	resetFlow: () => void;
	createClientOwner: () => Promise<void>;
	createClientAgent: () => Promise<void>;
	issueClientVc: () => Promise<void>;
	createServerOwner: () => Promise<void>;
	createServerAgent: () => Promise<void>;
	issueServerVc: () => Promise<void>;
	attemptBlockedChat: () => Promise<void>;
	verifyIdentity: () => Promise<void>;
	sendChat: () => Promise<void>;
};

type IdentityFlowContextValue = {
	state: IdentityFlowState;
	commands: IdentityFlowCommands;
};

const IdentityFlowContext = createContext<IdentityFlowContextValue | undefined>(
	undefined
);

function getErrorMessage(err: unknown): string {
	return err instanceof Error ? err.message : "Unknown error";
}

async function parseErrorMessage(res: Response): Promise<string> {
	try {
		const body = (await res.json()) as { error?: string };
		if (body.error) {
			return body.error;
		}
	} catch {
		// Ignore parse failures and fall back to status message.
	}
	return `Server error: ${res.status}`;
}

export function IdentityFlowProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(
		identityFlowReducer,
		undefined,
		createInitialIdentityFlowState
	);

	async function runOperation<T>(options: {
		operation: IdentityOperation;
		cascade?: IdentityCascade;
		request: () => Promise<Response>;
		onSuccess: (payload: T) => void;
		allowErrorStatus?: (status: number) => boolean;
	}) {
		if (state.requests[options.operation].status === "loading") {
			return;
		}

		dispatch({ type: "OPERATION_STARTED", operation: options.operation });
		if (options.cascade) {
			dispatch({ type: "APPLY_CASCADE", cascade: options.cascade });
		}

		try {
			const res = await options.request();
			const canAllow = options.allowErrorStatus?.(res.status) ?? false;
			if (!(res.ok || canAllow)) {
				throw new Error(await parseErrorMessage(res));
			}
			const payload = (await res.json()) as T;
			options.onSuccess(payload);
			dispatch({ type: "OPERATION_SUCCEEDED", operation: options.operation });
		} catch (err) {
			dispatch({
				type: "OPERATION_FAILED",
				operation: options.operation,
				error: getErrorMessage(err),
			});
		}
	}

	const commands = useMemo<IdentityFlowCommands>(
		() => ({
			setChatMessage(message) {
				dispatch({ type: "SET_CHAT_MESSAGE", message });
			},
			resetFlow() {
				dispatch({ type: "APPLY_CASCADE", cascade: "all" });
			},
			async createClientOwner() {
				await runOperation<IdentityArtifacts>({
					operation: "createClientOwner",
					cascade: "clientOwner",
					request: () => fetch("/api/session", { method: "POST" }),
					onSuccess(payload) {
						dispatch({ type: "SET_CLIENT_OWNER", payload });
					},
				});
			},
			async createClientAgent() {
				await runOperation<IdentityArtifacts>({
					operation: "createClientAgent",
					cascade: "clientAgent",
					request: () => fetch("/api/agents/client", { method: "POST" }),
					onSuccess(payload) {
						dispatch({ type: "SET_CLIENT_AGENT", payload });
					},
				});
			},
			async issueClientVc() {
				await runOperation<VcArtifacts>({
					operation: "issueClientVc",
					cascade: "clientVc",
					request: () => fetch("/api/issue", { method: "POST" }),
					onSuccess(payload) {
						dispatch({ type: "SET_CLIENT_VC", payload });
					},
				});
			},
			async createServerOwner() {
				await runOperation<IdentityArtifacts>({
					operation: "createServerOwner",
					cascade: "serverOwner",
					request: () => fetch("/api/owners/server", { method: "POST" }),
					onSuccess(payload) {
						dispatch({ type: "SET_SERVER_OWNER", payload });
					},
				});
			},
			async createServerAgent() {
				await runOperation<IdentityArtifacts>({
					operation: "createServerAgent",
					cascade: "serverAgent",
					request: () => fetch("/api/agents/server", { method: "POST" }),
					onSuccess(payload) {
						dispatch({ type: "SET_SERVER_AGENT", payload });
					},
				});
			},
			async issueServerVc() {
				await runOperation<VcArtifacts>({
					operation: "issueServerVc",
					cascade: "serverVc",
					request: () => fetch("/api/issue/server", { method: "POST" }),
					onSuccess(payload) {
						dispatch({ type: "SET_SERVER_VC", payload });
					},
				});
			},
			async attemptBlockedChat() {
				await runOperation<ChatResult>({
					operation: "attemptBlockedChat",
					cascade: "blockedAttempt",
					request: () =>
						fetch("/api/agents/server/chat", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								message: state.interaction.chatMessage,
							}),
						}),
					onSuccess(payload) {
						dispatch({ type: "SET_BLOCKED_RESULT", payload });
					},
				});
			},
			async verifyIdentity() {
				await runOperation<VerifyResult>({
					operation: "verifyIdentity",
					cascade: "verify",
					request: () => fetch("/api/interact", { method: "POST" }),
					onSuccess(payload) {
						dispatch({ type: "SET_VERIFY_RESULT", payload });
					},
				});
			},
			async sendChat() {
				await runOperation<ChatResult>({
					operation: "sendChat",
					cascade: "chat",
					request: () =>
						fetch("/api/agents/server/chat", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								message: state.interaction.chatMessage,
							}),
						}),
					allowErrorStatus(status) {
						return status === 403;
					},
					onSuccess(payload) {
						dispatch({ type: "SET_CHAT_RESULT", payload });
					},
				});
			},
		}),
		[state.interaction.chatMessage, state.requests]
	);

	const value = useMemo<IdentityFlowContextValue>(
		() => ({ state, commands }),
		[state, commands]
	);

	return (
		<IdentityFlowContext.Provider value={value}>
			{children}
		</IdentityFlowContext.Provider>
	);
}

export function useIdentityFlowContext(): IdentityFlowContextValue {
	const context = useContext(IdentityFlowContext);
	if (!context) {
		throw new Error("useIdentityFlow must be used within IdentityFlowProvider");
	}
	return context;
}
