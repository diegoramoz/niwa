import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { Turnkey as TurnkeyServerSDK } from "@turnkey/sdk-server";
import { config as dotenvConfig } from "dotenv";

const CAIP2_SEPOLIA = "eip155:11155111";
const POLL_INTERVAL_MS = 2000;
const POLL_MAX_ATTEMPTS = 30;
type Scenario = "allowed" | "approval" | "denied" | "self-delete";

async function pollTransactionStatus(
	client: TurnkeyServerSDK,
	organizationId: string,
	sendTransactionStatusId: string
): Promise<string | null> {
	for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
		const res = await client.apiClient().getSendTransactionStatus({
			organizationId,
			sendTransactionStatusId,
		});
		const txStatus = res.txStatus;
		if (txStatus === "INCLUDED") {
			return res.eth?.txHash ?? null;
		}
		if (txStatus === "FAILED" || res.txError) {
			const msg = res.error?.message ?? res.txError ?? txStatus;
			const chain = (res.error?.revertChain ?? [])
				.map((e) => e.displayMessage)
				.filter((m): m is string => Boolean(m))
				.join(" → ");
			console.error(
				`\n  Transaction failed: ${msg}${chain ? `\n  Revert chain  : ${chain}` : ""}`
			);
			return null;
		}
		process.stdout.write(i === 0 ? "  Waiting" : ".");
		await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
	}
	console.error("\n  Timed out waiting for confirmation.");
	return null;
}

// A throwaway Sepolia address used for "denied" txs (no matching ALLOW policy)
const DENIED_RECIPIENT = "0x0000000000000000000000000000000000000001";

function isScenario(value: string | undefined): value is Scenario {
	return (
		value === "allowed" ||
		value === "approval" ||
		value === "denied" ||
		value === "self-delete"
	);
}

function printUsageAndExit(): never {
	console.error(
		"Usage: pnpm agent <allowed|approval|denied|self-delete> <walletAddress> <organizationId>\n\n" +
			"  allowed      — tx to ALLOWED_RECIPIENT, passes policy A immediately\n" +
			"  approval     — tx to APPROVAL_RECIPIENT, needs user approval (policy B)\n" +
			"  denied       — tx to unknown address, rejected by default-deny\n" +
			"  self-delete  — agent deletes itself (policy C)\n\n" +
			"Example:\n" +
			"  pnpm agent allowed 0xAbc... f5a6b7c8-..."
	);
	process.exit(1);
}

function parseArgs() {
	const [scenario, walletAddress, organizationId] = process.argv.slice(2);
	if (!(isScenario(scenario) && walletAddress && organizationId)) {
		printUsageAndExit();
	}

	return { organizationId, scenario, walletAddress };
}

function resolveRecipient(
	scenario: Exclude<Scenario, "self-delete">,
	allowedRecipient: string,
	approvalRecipient: string
) {
	if (scenario === "allowed") {
		return allowedRecipient;
	}
	if (scenario === "approval") {
		return approvalRecipient;
	}
	return DENIED_RECIPIENT;
}

async function runSelfDeleteScenario(
	agentClient: TurnkeyServerSDK,
	organizationId: string
) {
	const whoami = await agentClient.apiClient().getWhoami({ organizationId });
	const agentUserId = whoami.userId;

	console.log(
		[
			"Deleting agent user (self-remediation)…",
			`  Agent user ID : ${agentUserId}`,
		].join("\n")
	);

	try {
		const deleteRes = await agentClient.apiClient().deleteUsers({
			organizationId,
			userIds: [agentUserId],
		});

		const deleteStatus = deleteRes.activity?.status ?? "unknown";
		if (deleteStatus === "ACTIVITY_STATUS_COMPLETED") {
			console.log(
				[
					"Agent user deleted.",
					`  Activity ID   : ${deleteRes.activity?.id}`,
					`  Deleted users : ${deleteRes.userIds?.join(", ")}`,
				].join("\n")
			);
			return;
		}

		console.log(
			[
				`Unexpected activity status: ${deleteStatus}`,
				`  Activity ID : ${deleteRes.activity?.id}`,
			].join("\n")
		);
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		console.error(`Self-delete rejected:\n  ${msg}`);
		process.exit(0);
	}
}

async function sendTransactionOrExit(
	agentClient: TurnkeyServerSDK,
	organizationId: string,
	walletAddress: string,
	toAddress: string
) {
	try {
		return await agentClient.apiClient().ethSendTransaction({
			organizationId,
			from: walletAddress,
			to: toAddress,
			value: "10000000000000000", // 0.01 ETH in wei
			caip2: CAIP2_SEPOLIA,
			sponsor: true,
		});
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		console.error(`Transaction rejected:\n  ${msg}`);
		process.exit(0);
	}
}

async function runTransactionScenario(
	agentClient: TurnkeyServerSDK,
	scenario: Exclude<Scenario, "self-delete">,
	walletAddress: string,
	organizationId: string
) {
	const allowedRecipient = requiredEnv("NEXT_PUBLIC_ALLOWED_RECIPIENT");
	const approvalRecipient = requiredEnv("NEXT_PUBLIC_APPROVAL_RECIPIENT");
	const toAddress = resolveRecipient(
		scenario,
		allowedRecipient,
		approvalRecipient
	);

	console.log(
		[
			`Sending tx as agent (scenario: ${scenario})`,
			`  From   : ${walletAddress}`,
			`  To     : ${toAddress}`,
			`  Network: Sepolia (${CAIP2_SEPOLIA})`,
			"",
			"Submitting…",
		].join("\n")
	);

	const res = await sendTransactionOrExit(
		agentClient,
		organizationId,
		walletAddress,
		toAddress
	);
	const activity = res.activity;
	const statusId = res.sendTransactionStatusId;
	const status = activity?.status ?? "unknown";

	if (status === "ACTIVITY_STATUS_COMPLETED") {
		console.log(
			[
				"Transaction submitted. Polling for confirmation…",
				`  Activity ID : ${activity?.id}`,
				`  Status ID   : ${statusId}`,
			].join("\n")
		);

		const txHash = await pollTransactionStatus(
			agentClient,
			organizationId,
			statusId
		);
		if (txHash) {
			console.log("");
			console.log(`  Tx hash     : ${txHash}`);
			console.log(`  Explorer    : https://sepolia.etherscan.io/tx/${txHash}`);
		}
		return;
	}

	if (status === "ACTIVITY_STATUS_CONSENSUS_NEEDED") {
		console.log(
			[
				"Transaction is awaiting user approval (CONSENSUS_NEEDED).",
				`  Activity ID : ${activity?.id}`,
				`  Fingerprint : ${activity?.fingerprint}`,
				"",
				"Go to the Test tab in the browser and click Approve.",
			].join("\n")
		);
		return;
	}

	console.log(
		[
			`Unexpected activity status: ${status}`,
			`  Activity ID : ${activity?.id}`,
		].join("\n")
	);
}

function loadEnv() {
	for (const file of [".env", ".env.local"]) {
		const envPath = resolve(process.cwd(), file);
		if (existsSync(envPath)) {
			dotenvConfig({ path: envPath, override: file === ".env.local" });
		}
	}
}

function requiredEnv(name: string): string {
	const value = process.env[name]?.trim();
	if (!value) {
		throw new Error(`Missing ${name}. Add it to your .env.local file.`);
	}
	return value;
}

async function main() {
	loadEnv();
	const { scenario, walletAddress, organizationId } = parseArgs();

	const apiPublicKey = requiredEnv("NEXT_PUBLIC_AGENT_API_PUBLIC_KEY");
	const apiPrivateKey = requiredEnv("AGENT_API_PRIVATE_KEY");
	const baseUrl =
		process.env.NEXT_PUBLIC_BASE_URL?.trim() || "https://api.turnkey.com";

	const agentClient = new TurnkeyServerSDK({
		apiBaseUrl: baseUrl,
		apiPublicKey,
		apiPrivateKey,
		defaultOrganizationId: organizationId,
	});

	if (scenario === "self-delete") {
		await runSelfDeleteScenario(agentClient, organizationId);
		return;
	}

	await runTransactionScenario(
		agentClient,
		scenario,
		walletAddress,
		organizationId
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
