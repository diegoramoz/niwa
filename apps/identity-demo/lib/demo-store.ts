import type { Agent } from "lib/identity/agent";
import type { OwnershipCredentialResult } from "lib/identity/credential";
import type { Owner } from "lib/identity/owner";

export type DemoSession = {
	id: string;
	clientOwner: Owner | null;
	clientAgent: Agent | null;
	clientOwnershipVC: OwnershipCredentialResult | null;
	serverOwner: Owner | null;
	serverAgent: Agent | null;
	serverOwnershipVC: OwnershipCredentialResult | null;
	identityVerified: boolean;
	verificationLog: string[];
	createdAt: Date;
};

// Module-level singleton store — ephemeral, lives only for the process lifetime.
const sessions = new Map<string, DemoSession>();

const DEFAULT_SESSION_ID = "default";

export function getSession(id = DEFAULT_SESSION_ID): DemoSession {
	let session = sessions.get(id);
	if (!session) {
		session = {
			id,
			clientOwner: null,
			clientAgent: null,
			clientOwnershipVC: null,
			serverOwner: null,
			serverAgent: null,
			serverOwnershipVC: null,
			identityVerified: false,
			verificationLog: [],
			createdAt: new Date(),
		};
		sessions.set(id, session);
	}
	return session;
}

export function setClientOwner(owner: Owner, id = DEFAULT_SESSION_ID): void {
	const session = getSession(id);
	session.clientOwner = owner;
}

export function setClientAgent(agent: Agent, id = DEFAULT_SESSION_ID): void {
	const session = getSession(id);
	session.clientAgent = agent;
}

export function setClientOwnershipVC(
	vc: OwnershipCredentialResult,
	id = DEFAULT_SESSION_ID
): void {
	const session = getSession(id);
	session.clientOwnershipVC = vc;
}

export function setServerOwner(owner: Owner, id = DEFAULT_SESSION_ID): void {
	const session = getSession(id);
	session.serverOwner = owner;
}

export function setServerAgent(agent: Agent, id = DEFAULT_SESSION_ID): void {
	const session = getSession(id);
	session.serverAgent = agent;
}

export function setServerOwnershipVC(
	vc: OwnershipCredentialResult,
	id = DEFAULT_SESSION_ID
): void {
	const session = getSession(id);
	session.serverOwnershipVC = vc;
}

export function setIdentityVerified(
	log: string[],
	id = DEFAULT_SESSION_ID
): void {
	const session = getSession(id);
	session.identityVerified = true;
	session.verificationLog = log;
}

export function resetSession(id = DEFAULT_SESSION_ID): void {
	sessions.delete(id);
}
