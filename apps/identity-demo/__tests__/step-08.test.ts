import {
	getSession,
	resetSession,
	setClientAgent,
	setClientOwner,
	setClientOwnershipVC,
	setServerAgent,
	setServerOwner,
	setServerOwnershipVC,
} from "lib/demo-store";
import { createAgent } from "lib/identity/agent";
import { issueOwnershipCredential } from "lib/identity/credential";
import { createOwner } from "lib/identity/owner";
import { describe, expect, it } from "vitest";
import { POST as postInteract } from "@/app/api/interact/route";

const BASE_URL = "http://localhost:3000";

describe("Step 8: interact route mutual verification", () => {
	it("verifies both ownership VCs through the interact route", async () => {
		resetSession();

		const clientOwner = await createOwner();
		const clientAgent = await createAgent({
			namespace: "client",
			baseUrl: BASE_URL,
			controller: clientOwner.did,
		});
		const clientVC = await issueOwnershipCredential({
			ownerDid: clientOwner.did,
			ownerSigner: clientOwner.signer,
			ownerAlgorithm: clientOwner.algorithm,
			agentDid: clientAgent.did,
			agentDidDocument: clientAgent.didDocument,
		});

		const serverOwner = await createOwner();
		const serverAgent = await createAgent({
			namespace: "server",
			baseUrl: BASE_URL,
			controller: serverOwner.did,
		});
		const serverVC = await issueOwnershipCredential({
			ownerDid: serverOwner.did,
			ownerSigner: serverOwner.signer,
			ownerAlgorithm: serverOwner.algorithm,
			agentDid: serverAgent.did,
			agentDidDocument: serverAgent.didDocument,
		});

		setClientOwner(clientOwner);
		setClientAgent(clientAgent);
		setClientOwnershipVC(clientVC);
		setServerOwner(serverOwner);
		setServerAgent(serverAgent);
		setServerOwnershipVC(serverVC);

		const response = await postInteract();
		expect(response.status).toBe(200);

		const body = (await response.json()) as {
			verified: boolean;
			log: string[];
		};
		expect(body.verified).toBe(true);
		expect(body.log).toContain("✓ Server agent verified client ownership VC");
		expect(body.log).toContain("✓ Client agent verified server ownership VC");
		expect(getSession().identityVerified).toBe(true);
	});

	it("returns 400 when required agents are missing", async () => {
		resetSession();

		const response = await postInteract();
		expect(response.status).toBe(400);

		const body = (await response.json()) as { error: string };
		expect(body.error).toContain("Client ownership VC not yet issued");
	});
});
