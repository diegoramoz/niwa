"use client";

import {
	AuthState,
	useTurnkey,
	type Wallet,
	WalletSource,
} from "@turnkey/react-wallet-kit";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type PolicyDetail = {
	condition?: string;
	consensus?: string;
	effect: string;
	notes?: string;
	policyId: string;
	policyName: string;
};

type AgentSetup = {
	agentUserId: string;
	policies: PolicyDetail[];
};

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="space-y-0.5">
			<div className="text-gray-400 text-xs">{label}</div>
			<div className="break-all font-mono text-gray-700 text-xs">{value}</div>
		</div>
	);
}

const POLICY_NAMES = [
	"agent-allow-free",
	"agent-allow-with-approval",
	"agent-self-delete",
];

function requiredClientEnv(name: string): string {
	const value = process.env[name]?.trim();
	if (!value) {
		throw new Error(`Missing ${name}. Add it to your .env.local file.`);
	}
	return value;
}

export default function SetupPage() {
	const router = useRouter();
	const {
		authState,
		logout,
		session,
		wallets,
		httpClient,
		fetchOrCreateP256ApiKeyUser,
		fetchOrCreatePolicies,
	} = useTurnkey();

	useEffect(() => {
		if (authState === AuthState.Unauthenticated) {
			router.replace("/");
		}
	}, [authState, router]);

	const walletAddress = useMemo(() => {
		return (
			(wallets ?? [])
				.filter((w: Wallet) => w.source === WalletSource.Embedded)
				.flatMap((w) => w.accounts ?? [])
				.find((a) => a.addressFormat?.includes("ETHEREUM"))?.address ?? null
		);
	}, [wallets]);

	const [setup, setSetup] = useState<AgentSetup | null>(null);
	const [loadingSetup, setLoadingSetup] = useState(false);
	const [setting, setSetting] = useState(false);
	const [err, setErr] = useState<string | null>(null);

	// Load existing agent state whenever the session is ready
	useEffect(() => {
		if (authState !== AuthState.Authenticated) {
			return;
		}
		if (!(httpClient && session?.organizationId)) {
			return;
		}

		const orgId = session.organizationId;
		const agentPublicKey = process.env.NEXT_PUBLIC_AGENT_API_PUBLIC_KEY;
		if (!agentPublicKey) {
			return;
		}

		setLoadingSetup(true);
		const loadExistingSetup = async () => {
			try {
				const [usersRes, policiesRes] = await Promise.all([
					httpClient.getUsers({ organizationId: orgId }),
					httpClient.getPolicies({ organizationId: orgId }),
				]);

				const agentUser = usersRes.users.find((u) =>
					u.apiKeys.some((k) => k.credential.publicKey === agentPublicKey)
				);
				if (!agentUser) {
					return;
				}

				const agentPolicies = POLICY_NAMES.map((name) =>
					policiesRes.policies.find((p) => p.policyName === name)
				).filter((p): p is NonNullable<typeof p> => p !== undefined);
				if (agentPolicies.length === 0) {
					return;
				}

				setSetup({
					agentUserId: agentUser.userId,
					policies: agentPolicies.map((p) => ({
						policyId: p.policyId,
						policyName: p.policyName,
						effect: p.effect,
						condition: p.condition,
						consensus: p.consensus,
						notes: p.notes,
					})),
				});
			} catch {
				// not configured yet
			} finally {
				setLoadingSetup(false);
			}
		};

		loadExistingSetup().catch(() => {
			setLoadingSetup(false);
		});
	}, [authState, httpClient, session?.organizationId]);

	const handleSetup = async () => {
		if (!(session?.organizationId && httpClient)) {
			return;
		}
		setSetting(true);
		setErr(null);
		try {
			const agentPublicKey = requiredClientEnv(
				"NEXT_PUBLIC_AGENT_API_PUBLIC_KEY"
			);
			const allowedRecipient = requiredClientEnv(
				"NEXT_PUBLIC_ALLOWED_RECIPIENT"
			);
			const approvalRecipient = requiredClientEnv(
				"NEXT_PUBLIC_APPROVAL_RECIPIENT"
			);

			// Resolve the human user's ID so we can pin it in the approval policy consensus
			const whoami = await httpClient.getWhoami({
				organizationId: session.organizationId,
			});
			const humanUserId = whoami.userId;

			// Create or find the agent non-root user (stamped with the user's session key)
			const agentUser = await fetchOrCreateP256ApiKeyUser({
				publicKey: agentPublicKey,
				createParams: {
					userName: "agent",
					apiKeyName: "agent-key",
				},
			});
			const agentUserId = agentUser.userId;

			// Create or find the three signing policies
			const policiesRes = await fetchOrCreatePolicies({
				policies: [
					{
						policyName: "agent-allow-free",
						effect: "EFFECT_ALLOW",
						condition: `eth.tx.to == '${allowedRecipient.toLowerCase()}'`,
						consensus: `approvers.any(user, user.id == '${agentUserId}')`,
						notes:
							"Agent may freely sign transactions to the allowed recipient.",
					},
					{
						policyName: "agent-allow-with-approval",
						effect: "EFFECT_ALLOW",
						condition: `eth.tx.to == '${approvalRecipient.toLowerCase()}'`,
						consensus: `approvers.any(user, user.id == '${agentUserId}') && approvers.any(user, user.id == '${humanUserId}')`,
						notes:
							"Agent may sign to the approval recipient only after the human user approves (agent + human, both required).",
					},
					{
						policyName: "agent-self-delete",
						effect: "EFFECT_ALLOW",
						condition: `activity.type == 'ACTIVITY_TYPE_DELETE_USERS' && activity.params.user_ids.count() == 1 && '${agentUserId}' in activity.params.user_ids`,
						consensus: `approvers.any(user, user.id == '${agentUserId}')`,
						notes: "Agent may delete itself to self-remediate if compromised.",
					},
				],
			});

			setSetup({
				agentUserId,
				policies: policiesRes.map((p) => ({
					policyId: p.policyId,
					policyName: p.policyName,
					effect: p.effect,
					condition: p.condition,
					consensus: p.consensus,
					notes: p.notes,
				})),
			});
		} catch (e: unknown) {
			setErr(e instanceof Error ? e.message : "Setup failed.");
		} finally {
			setSetting(false);
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
			window.location.replace("/");
		} catch (e) {
			console.error("Logout failed:", e);
		}
	};

	if (authState !== AuthState.Authenticated) {
		return <p className="p-6 text-gray-500 text-sm">Loading…</p>;
	}

	let setupButtonLabel = "Setup agent";
	if (setting) {
		setupButtonLabel = "Setting up…";
	} else if (loadingSetup) {
		setupButtonLabel = "Loading…";
	} else if (setup) {
		setupButtonLabel = "Re-run setup";
	}

	const orgId = session?.organizationId ?? "—";

	return (
		<main className="p-6">
			<button
				className="absolute top-4 right-4 rounded bg-red-600 px-3 py-1.5 text-white text-xs hover:bg-red-700"
				onClick={handleLogout}
				type="button"
			>
				Logout
			</button>

			<div className="mx-auto max-w-2xl space-y-6 pt-4">
				<div>
					<h1 className="font-bold text-gray-900 text-lg">Agent Setup</h1>
					<p className="mt-1 text-gray-500 text-sm">
						Creates a non-root agent user and three signing policies in your
						sub-org using your session key. Safe to run multiple times —
						already-created resources are reused.
					</p>
				</div>

				{/* Sub-org info */}
				<section className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
					<h2 className="font-semibold text-gray-800 text-sm">Sub-org</h2>
					<InfoRow label="Organization ID" value={orgId} />
					<InfoRow
						label="Wallet address"
						value={walletAddress ?? "(loading…)"}
					/>
					<InfoRow
						label="Agent public key"
						value={
							process.env.NEXT_PUBLIC_AGENT_API_PUBLIC_KEY ?? "(not configured)"
						}
					/>
					<InfoRow
						label="Allowed recipient"
						value={
							process.env.NEXT_PUBLIC_ALLOWED_RECIPIENT ?? "(not configured)"
						}
					/>
					<InfoRow
						label="Approval recipient"
						value={
							process.env.NEXT_PUBLIC_APPROVAL_RECIPIENT ?? "(not configured)"
						}
					/>
				</section>

				{/* Setup button */}
				<section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
					<div>
						<h2 className="font-semibold text-gray-800 text-sm">
							Configure policies
						</h2>
						<p className="mt-1 text-gray-500 text-xs">
							Your session key creates the agent user and policies directly in
							your sub-org — no admin key involved.
						</p>
					</div>

					<button
						className="rounded bg-slate-700 px-5 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50"
						disabled={setting || loadingSetup}
						onClick={handleSetup}
						type="button"
					>
						{setupButtonLabel}
					</button>

					{err && (
						<div className="rounded border border-red-300 bg-red-50 p-3 text-red-700 text-xs">
							{err}
						</div>
					)}

					{setup && (
						<div className="space-y-4 rounded border border-green-200 bg-green-50 p-4">
							<div className="font-semibold text-green-800 text-xs">
								Agent configured
							</div>
							<InfoRow label="Agent user ID" value={setup.agentUserId} />
							{setup.policies.map((p) => (
								<div className="space-y-1" key={p.policyId}>
									<div className="text-gray-400 text-xs">{p.policyName}</div>
									<div className="break-all font-mono text-gray-600 text-xs">
										{p.policyId}
									</div>
									<pre className="whitespace-pre-wrap break-all rounded border border-gray-100 bg-white p-2 font-mono text-[10px] text-gray-700">
										{JSON.stringify(
											{
												effect: p.effect,
												condition: p.condition,
												consensus: p.consensus,
											},
											null,
											2
										)}
									</pre>
								</div>
							))}
						</div>
					)}
				</section>

				{setup && (
					<button
						className="w-full rounded bg-blue-600 px-5 py-2.5 font-medium text-sm text-white hover:bg-blue-700"
						onClick={() => router.push("/dashboard/test")}
						type="button"
					>
						Test setup →
					</button>
				)}
			</div>
		</main>
	);
}
