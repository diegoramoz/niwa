import type { Owner } from "@/lib/identity/owner";

export type DemoSession = {
	id: string;
	clientOwner: Owner | null;
	createdAt: Date;
};

// Module-level singleton store — ephemeral, lives only for the process lifetime.
const sessions = new Map<string, DemoSession>();

const DEFAULT_SESSION_ID = "default";

export function getSession(id = DEFAULT_SESSION_ID): DemoSession {
	let session = sessions.get(id);
	if (!session) {
		session = { id, clientOwner: null, createdAt: new Date() };
		sessions.set(id, session);
	}
	return session;
}

export function setClientOwner(owner: Owner, id = DEFAULT_SESSION_ID): void {
	const session = getSession(id);
	session.clientOwner = owner;
}

export function resetSession(id = DEFAULT_SESSION_ID): void {
	sessions.delete(id);
}
