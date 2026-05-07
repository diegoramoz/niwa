import {
	createInitialIdentityFlowState,
	type IdentityFlowAction,
	type IdentityFlowState,
} from "./identity-flow.types";

export function identityFlowReducer(
	state: IdentityFlowState,
	action: IdentityFlowAction
): IdentityFlowState {
	switch (action.type) {
		case "SET_CHAT_MESSAGE":
			return {
				...state,
				interaction: {
					...state.interaction,
					chatMessage: action.message,
				},
			};
		case "APPLY_CASCADE": {
			switch (action.cascade) {
				case "clientOwner":
					return {
						...state,
						setup: {
							clientOwner: null,
							clientAgent: null,
							clientVc: null,
							serverOwner: null,
							serverAgent: null,
							serverVc: null,
						},
						interaction: {
							...state.interaction,
							blockedResult: null,
							verifyResult: null,
							chatResult: null,
						},
					};
				case "clientAgent":
					return {
						...state,
						setup: {
							...state.setup,
							clientAgent: null,
							clientVc: null,
							serverOwner: null,
							serverAgent: null,
							serverVc: null,
						},
						interaction: {
							...state.interaction,
							blockedResult: null,
							verifyResult: null,
							chatResult: null,
						},
					};
				case "clientVc":
					return {
						...state,
						setup: {
							...state.setup,
							clientVc: null,
							serverOwner: null,
							serverAgent: null,
							serverVc: null,
						},
						interaction: {
							...state.interaction,
							blockedResult: null,
							verifyResult: null,
							chatResult: null,
						},
					};
				case "serverOwner":
					return {
						...state,
						setup: {
							...state.setup,
							serverOwner: null,
							serverAgent: null,
							serverVc: null,
						},
						interaction: {
							...state.interaction,
							blockedResult: null,
							verifyResult: null,
							chatResult: null,
						},
					};
				case "serverAgent":
					return {
						...state,
						setup: {
							...state.setup,
							serverAgent: null,
							serverVc: null,
						},
						interaction: {
							...state.interaction,
							blockedResult: null,
							verifyResult: null,
							chatResult: null,
						},
					};
				case "serverVc":
					return {
						...state,
						setup: {
							...state.setup,
							serverVc: null,
						},
						interaction: {
							...state.interaction,
							blockedResult: null,
							verifyResult: null,
							chatResult: null,
						},
					};
				case "blockedAttempt":
					return {
						...state,
						interaction: {
							...state.interaction,
							blockedResult: null,
						},
					};
				case "verify":
					return {
						...state,
						interaction: {
							...state.interaction,
							verifyResult: null,
							chatResult: null,
						},
					};
				case "chat":
					return {
						...state,
						interaction: {
							...state.interaction,
							chatResult: null,
						},
					};
				case "all":
					return createInitialIdentityFlowState();
				default:
					return state;
			}
		}
		case "SET_CLIENT_OWNER":
			return {
				...state,
				setup: {
					...state.setup,
					clientOwner: action.payload,
				},
			};
		case "SET_CLIENT_AGENT":
			return {
				...state,
				setup: {
					...state.setup,
					clientAgent: action.payload,
				},
			};
		case "SET_CLIENT_VC":
			return {
				...state,
				setup: {
					...state.setup,
					clientVc: action.payload,
				},
			};
		case "SET_SERVER_OWNER":
			return {
				...state,
				setup: {
					...state.setup,
					serverOwner: action.payload,
				},
			};
		case "SET_SERVER_AGENT":
			return {
				...state,
				setup: {
					...state.setup,
					serverAgent: action.payload,
				},
			};
		case "SET_SERVER_VC":
			return {
				...state,
				setup: {
					...state.setup,
					serverVc: action.payload,
				},
			};
		case "SET_BLOCKED_RESULT":
			return {
				...state,
				interaction: {
					...state.interaction,
					blockedResult: action.payload,
				},
			};
		case "SET_VERIFY_RESULT":
			return {
				...state,
				interaction: {
					...state.interaction,
					verifyResult: action.payload,
				},
			};
		case "SET_CHAT_RESULT":
			return {
				...state,
				interaction: {
					...state.interaction,
					chatResult: action.payload,
				},
			};
		case "OPERATION_STARTED":
			return {
				...state,
				requests: {
					...state.requests,
					[action.operation]: { status: "loading" },
				},
			};
		case "OPERATION_SUCCEEDED":
			return {
				...state,
				requests: {
					...state.requests,
					[action.operation]: { status: "success" },
				},
			};
		case "OPERATION_FAILED":
			return {
				...state,
				requests: {
					...state.requests,
					[action.operation]: {
						status: "error",
						error: action.error,
					},
				},
			};
		default:
			return state;
	}
}
