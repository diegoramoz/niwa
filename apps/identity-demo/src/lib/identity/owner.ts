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

export type Owner = {
	did: DidUri;
	didDocument: DidDocument;
	signer: JwtSigner;
	algorithm: JwtAlgorithm;
};

export async function createOwner(): Promise<Owner> {
	const keypair = await generateKeypair("secp256k1");
	const did = createDidKeyUri(keypair);
	const didDocument = createDidDocumentFromKeypair({ did, keypair });
	const signer = createJwtSigner(keypair);

	return {
		did,
		didDocument,
		signer,
		algorithm: curveToJwtAlgorithm(keypair.curve),
	};
}
