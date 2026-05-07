import type {
	ChatResult,
	IdentityArtifacts,
	VcArtifacts,
	VerifyResult,
} from "../types";

export const DEFAULT_CHAT_MESSAGE = "Write me a haiku";

export type IdentityOperation =
	| "createClientOwner"
	| "createClientAgent"
	| "issueClientVc"
	| "createServerOwner"
	| "createServerAgent"
	| "issueServerVc"
	| "attemptBlockedChat"
	| "verifyIdentity"
	| "sendChat";

export type RequestState =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "success" }
	| { status: "error"; error: string };

export type RequestMap = Record<IdentityOperation, RequestState>;

export type SetupState = {
	clientOwner: IdentityArtifacts | null;
	clientAgent: IdentityArtifacts | null;
	clientVc: VcArtifacts | null;
	serverOwner: IdentityArtifacts | null;
	serverAgent: IdentityArtifacts | null;
	serverVc: VcArtifacts | null;
};

export type InteractionState = {
	chatMessage: string;
	blockedResult: ChatResult | null;
	verifyResult: VerifyResult | null;
	chatResult: ChatResult | null;
};

export type IdentityFlowState = {
	setup: SetupState;
	interaction: InteractionState;
	requests: RequestMap;
};

export type IdentityCascade =
	| "clientOwner"
	| "clientAgent"
	| "clientVc"
	| "serverOwner"
	| "serverAgent"
	| "serverVc"
	| "blockedAttempt"
	| "verify"
	| "chat"
	| "all";

export type IdentityFlowAction =
	| { type: "SET_CHAT_MESSAGE"; message: string }
	| { type: "APPLY_CASCADE"; cascade: IdentityCascade }
	| { type: "SET_CLIENT_OWNER"; payload: IdentityArtifacts }
	| { type: "SET_CLIENT_AGENT"; payload: IdentityArtifacts }
	| { type: "SET_CLIENT_VC"; payload: VcArtifacts }
	| { type: "SET_SERVER_OWNER"; payload: IdentityArtifacts }
	| { type: "SET_SERVER_AGENT"; payload: IdentityArtifacts }
	| { type: "SET_SERVER_VC"; payload: VcArtifacts }
	| { type: "SET_BLOCKED_RESULT"; payload: ChatResult }
	| { type: "SET_VERIFY_RESULT"; payload: VerifyResult }
	| { type: "SET_CHAT_RESULT"; payload: ChatResult }
	| { type: "OPERATION_STARTED"; operation: IdentityOperation }
	| { type: "OPERATION_SUCCEEDED"; operation: IdentityOperation }
	| { type: "OPERATION_FAILED"; operation: IdentityOperation; error: string };

export function createInitialRequestMap(): RequestMap {
	return {
		createClientOwner: { status: "idle" },
		createClientAgent: { status: "idle" },
		issueClientVc: { status: "idle" },
		createServerOwner: { status: "idle" },
		createServerAgent: { status: "idle" },
		issueServerVc: { status: "idle" },
		attemptBlockedChat: { status: "idle" },
		verifyIdentity: { status: "idle" },
		sendChat: { status: "idle" },
	};
}

export function createInitialIdentityFlowState(): IdentityFlowState {
	return {
		setup: {
			clientOwner: null,
			clientAgent: null,
			clientVc: null,
			serverOwner: null,
			serverAgent: null,
			serverVc: null,
		},
		interaction: {
			chatMessage: DEFAULT_CHAT_MESSAGE,
			blockedResult: null,
			verifyResult: null,
			chatResult: null,
		},
		requests: createInitialRequestMap(),
	};
}
