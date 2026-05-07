import {
	createDidDocumentFromKeypair,
	createDidKeyUri,
	createJwtSigner,
	curveToJwtAlgorithm,
	type DidDocument,
	type DidUri,
	generateKeypair,
	type JwtAlgorithm,
	type JwtSigner,
} from "agentcommercekit";

const TRAILING_SLASH = /\/$/;

export type Agent = {
	did: DidUri;
	didDocument: DidDocument;
	signer: JwtSigner;
	algorithm: JwtAlgorithm;
};

export type AgentNamespace = "client" | "server";

/**
 * Build the service endpoints for an agent DID document.
 *
 * The demo runs under a single host and differentiates client vs server agents
 * via route namespace, matching the PRD design:
 *   POST /api/agents/{namespace}/chat
 *   POST /api/agents/{namespace}/identity/challenge
 *   GET  /api/agents/{namespace}/identity/vc
 */
export function agentServiceEndpoints(
	namespace: AgentNamespace,
	baseUrl: string
): NonNullable<ConstructorParameters<typeof URL>[0]>[] {
	const base = baseUrl.replace(TRAILING_SLASH, "");
	return [
		{
			id: "#chat",
			type: "AgentChat",
			serviceEndpoint: `${base}/api/agents/${namespace}/chat`,
		},
		{
			id: "#identity-challenge",
			type: "IdentityChallenge",
			serviceEndpoint: `${base}/api/agents/${namespace}/identity/challenge`,
		},
		{
			id: "#identity-vc",
			type: "IdentityVC",
			serviceEndpoint: `${base}/api/agents/${namespace}/identity/vc`,
		},
	] as unknown as NonNullable<ConstructorParameters<typeof URL>[0]>[];
}

export type CreateAgentOptions = {
	namespace: AgentNamespace;
	/** The base URL of the app, used to build DID service endpoints. */
	baseUrl: string;
	/**
	 * Optional owner DID that controls this agent. When provided it is written
	 * into the DID document `controller` field, which is required for
	 * ControllerCredential verification.
	 */
	controller?: DidUri;
};

export async function createAgent(options: CreateAgentOptions): Promise<Agent> {
	const { namespace, baseUrl, controller } = options;
	const keypair = await generateKeypair("secp256k1");
	const did = createDidKeyUri(keypair);

	const service = [
		{
			id: `${did}#chat`,
			type: "AgentChat",
			serviceEndpoint: `${baseUrl.replace(TRAILING_SLASH, "")}/api/agents/${namespace}/chat`,
		},
		{
			id: `${did}#identity-challenge`,
			type: "IdentityChallenge",
			serviceEndpoint: `${baseUrl.replace(TRAILING_SLASH, "")}/api/agents/${namespace}/identity/challenge`,
		},
		{
			id: `${did}#identity-vc`,
			type: "IdentityVC",
			serviceEndpoint: `${baseUrl.replace(TRAILING_SLASH, "")}/api/agents/${namespace}/identity/vc`,
		},
	];

	const didDocument = createDidDocumentFromKeypair({
		did,
		keypair,
		service,
		...(controller ? { controller } : {}),
	});
	const signer = createJwtSigner(keypair);

	return {
		did,
		didDocument,
		signer,
		algorithm: curveToJwtAlgorithm(keypair.curve),
	};
}
