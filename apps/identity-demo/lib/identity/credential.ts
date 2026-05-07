import {
	createControllerCredential,
	type DidDocument,
	type DidUri,
	getControllerClaimVerifier,
	getDidResolver,
	type JwtAlgorithm,
	type JwtSigner,
	parseJwtCredential,
	signCredential,
	verifyParsedCredential,
} from "agentcommercekit";

export type IssueOwnershipCredentialOptions = {
	ownerDid: DidUri;
	ownerSigner: JwtSigner;
	ownerAlgorithm: JwtAlgorithm;
	agentDid: DidUri;
	/** Agent DID document (must include `controller: ownerDid`). */
	agentDidDocument: DidDocument;
};

export type OwnershipCredentialResult = {
	/** Signed JWT string */
	jwt: string;
	/** Human-readable verification outcome */
	verified: boolean;
	verificationError: string | null;
};

/**
 * Issue a ControllerCredential that attests the owner controls the agent,
 * then immediately parse and verify the signed JWT.
 */
export async function issueOwnershipCredential(
	options: IssueOwnershipCredentialOptions
): Promise<OwnershipCredentialResult> {
	const { ownerDid, ownerSigner, ownerAlgorithm, agentDid, agentDidDocument } =
		options;

	const credential = createControllerCredential({
		id: `${ownerDid}#ownership-${Date.now()}`,
		subject: agentDid,
		controller: ownerDid,
		issuer: ownerDid,
	});

	const jwt = await signCredential(credential, {
		did: ownerDid,
		signer: ownerSigner,
		alg: ownerAlgorithm,
	});

	const resolver = getDidResolver();
	// Seed the resolver cache with the agent's DID document so the controller
	// field (set at creation time) is visible during verification. did:key
	// resolution regenerates the document from the public key alone and omits
	// controller, so caching is required.
	resolver.addToCache(agentDid, agentDidDocument);

	let verified = false;
	let verificationError: string | null = null;

	try {
		const parsed = await parseJwtCredential(jwt, resolver);
		await verifyParsedCredential(parsed, {
			resolver,
			trustedIssuers: [ownerDid],
			verifiers: [getControllerClaimVerifier()],
		});
		verified = true;
	} catch (err) {
		verificationError =
			err instanceof Error ? err.message : "Verification failed";
	}

	return { jwt, verified, verificationError };
}
