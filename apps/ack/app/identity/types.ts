import type { DidDocument } from "agentcommercekit";

export type IdentityArtifacts = {
	did: string;
	didDocument: DidDocument;
};

export type VcArtifacts = {
	jwt: string;
	verified: boolean;
	verificationError: string | null;
};

export type VerifyResult = {
	verified: boolean;
	log: string[];
};

export type ChatResult = {
	blocked?: boolean;
	reason?: string;
	message?: string;
	haiku?: string;
};
