"use client";

import { env } from "@oss/env/turnkey";
import {
	AuthState,
	useTurnkey,
	type Wallet,
	WalletSource,
} from "@turnkey/react-wallet-kit";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ActivityEventEnvelope, ActivitySseMessage } from "@/lib/types";

const POLL_INTERVAL_MS = 2000;
const POLL_MAX_ATTEMPTS = 30;

type TurnkeyHttpClient = NonNullable<
	ReturnType<typeof useTurnkey>["httpClient"]
>;

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchStatusId(
	httpClient: TurnkeyHttpClient,
	organizationId: string,
	activityId: string
) {
	try {
		const { activity } = await httpClient.getActivity({
			organizationId,
			activityId,
		});
		return (
			activity.result?.ethSendTransactionResult?.sendTransactionStatusId ?? null
		);
	} catch {
		return null;
	}
}

async function pollTransactionResult(
	httpClient: TurnkeyHttpClient,
	organizationId: string,
	statusId: string
) {
	for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
		try {
			const res = await httpClient.getSendTransactionStatus({
				organizationId,
				sendTransactionStatusId: statusId,
			});
			if (res.txStatus === "INCLUDED") {
				return res.eth?.txHash ?? null;
			}
			if (res.txStatus === "FAILED" || res.txError) {
				return `error:${res.error?.message ?? res.txError ?? "Transaction failed"}`;
			}
		} catch (e) {
			return `error:${e instanceof Error ? e.message : String(e)}`;
		}

		await sleep(POLL_INTERVAL_MS);
	}

	return null;
}

function renderApprovalResult(result: string) {
	if (result.startsWith("0x")) {
		return (
			<span className="text-green-700">
				tx:{" "}
				<a
					className="underline"
					href={`https://sepolia.etherscan.io/tx/${result}`}
					rel="noopener noreferrer"
					target="_blank"
				>
					{result}
				</a>
			</span>
		);
	}

	if (result.startsWith("error:")) {
		return <span className="text-red-600">{result.slice(6)}</span>;
	}

	return <span className="text-gray-400">{result}</span>;
}

function statusBadge(status: string) {
	const map: Record<string, string> = {
		ACTIVITY_STATUS_COMPLETED: "bg-green-100 text-green-800",
		ACTIVITY_STATUS_CONSENSUS_NEEDED: "bg-yellow-100 text-yellow-800",
		ACTIVITY_STATUS_FAILED: "bg-red-100 text-red-800",
		ACTIVITY_STATUS_REJECTED: "bg-red-100 text-red-800",
		ACTIVITY_STATUS_CREATED: "bg-gray-100 text-gray-700",
		ACTIVITY_STATUS_PENDING: "bg-blue-100 text-blue-700",
	};
	const label = status.replace("ACTIVITY_STATUS_", "").replace(/_/g, " ");
	const cls = map[status] ?? "bg-gray-100 text-gray-600";
	return (
		<span className={`rounded px-1.5 py-0.5 font-medium text-[10px] ${cls}`}>
			{label}
		</span>
	);
}

function CopyBlock({ value }: { value: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<div className="flex items-center gap-2 rounded border border-gray-100 bg-gray-50 px-3 py-2">
			<code className="flex-1 break-all font-mono text-[11px] text-gray-800">
				{value}
			</code>
			<button
				className="shrink-0 rounded bg-gray-200 px-2 py-1 font-medium text-[10px] text-gray-700 hover:bg-gray-300"
				onClick={() => {
					navigator.clipboard.writeText(value).then(() => {
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					});
				}}
				type="button"
			>
				{copied ? "Copied!" : "Copy"}
			</button>
		</div>
	);
}

export default function TestPage() {
	const router = useRouter();
	const { authState, logout, session, wallets, httpClient } = useTurnkey();

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

	const orgId = session?.organizationId ?? null;

	// --- SSE event log ---
	const [events, setEvents] = useState<ActivityEventEnvelope[]>([]);
	const logRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const es = new EventSource("/api/events");

		es.addEventListener("message", (e: MessageEvent) => {
			let msg: ActivitySseMessage;
			try {
				msg = JSON.parse(e.data as string);
			} catch {
				return;
			}

			if (msg.type === "connected") {
				setEvents(msg.recentEvents);
			} else if (msg.type === "activity-update") {
				setEvents((prev) => {
					const next = [
						msg.event,
						...prev.filter((x) => x.id !== msg.event.id),
					];
					return next.slice(0, 50);
				});
			}
		});

		es.onerror = () => es.close();
		return () => es.close();
	}, []);

	useEffect(() => {
		logRef.current?.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	// --- User approval ---
	const [approvingId, setApprovingId] = useState<string | null>(null);
	const [approvalResults, setApprovalResults] = useState<
		Record<string, string>
	>({});

	const handleApprove = async (
		fingerprint: string,
		activityId: string,
		activityOrgId: string
	) => {
		if (!(httpClient && orgId)) {
			return;
		}
		setApprovingId(activityId);
		try {
			await httpClient.approveActivity({ fingerprint });
			const statusId = await fetchStatusId(
				httpClient,
				activityOrgId,
				activityId
			);

			if (!statusId) {
				setApprovalResults((prev) => ({ ...prev, [activityId]: "approved" }));
				return;
			}

			setApprovalResults((prev) => ({
				...prev,
				[activityId]: "confirming…",
			}));
			const txHash = await pollTransactionResult(
				httpClient,
				activityOrgId,
				statusId
			);
			setApprovalResults((prev) => ({
				...prev,
				[activityId]: txHash ?? "confirmed",
			}));
		} catch (e) {
			console.error("Approval failed:", e);
		} finally {
			setApprovingId(null);
		}
	};

	const isTerminal = (status: string) =>
		[
			"ACTIVITY_STATUS_COMPLETED",
			"ACTIVITY_STATUS_FAILED",
			"ACTIVITY_STATUS_REJECTED",
		].includes(status);

	if (authState !== AuthState.Authenticated) {
		return <p className="p-6 text-gray-500 text-sm">Loading…</p>;
	}

	return (
		<main className="p-6">
			<button
				className="absolute top-4 right-4 rounded bg-red-600 px-3 py-1.5 text-white text-xs hover:bg-red-700"
				onClick={async () => {
					try {
						await logout();
						window.location.replace("/");
					} catch (e) {
						console.error("Logout failed:", e);
					}
				}}
				type="button"
			>
				Logout
			</button>
			<div className="mx-auto max-w-2xl space-y-6 pt-4">
				<div>
					<h1 className="font-bold text-gray-900 text-lg">Test</h1>
					<p className="mt-1 text-gray-500 text-sm">
						Run agent CLI commands below, then watch the activity log update in
						real time via SSE.
					</p>
				</div>

				{/* How it works */}
				<section className="space-y-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
					<h2 className="font-semibold text-gray-800 text-sm">How it works</h2>
					<ul className="list-disc space-y-1.5 pl-4 text-gray-600 text-xs">
						<li>
							<span className="font-medium text-green-700">Allowed</span> —
							agent signs to{" "}
							<code className="font-mono">
								{env.NEXT_PUBLIC_ALLOWED_RECIPIENT ?? "ALLOWED_RECIPIENT"}
							</code>{" "}
							freely (Policy A, 1-of-1 consensus). Completes immediately.
						</li>
						<li>
							<span className="font-medium text-yellow-700">
								Approval required
							</span>{" "}
							— agent signs to{" "}
							<code className="font-mono">
								{env.NEXT_PUBLIC_APPROVAL_RECIPIENT ?? "APPROVAL_RECIPIENT"}
							</code>{" "}
							and the activity sits in{" "}
							<code className="font-mono">CONSENSUS_NEEDED</code> until you
							click Approve below (Policy B, agent + human required).
						</li>
						<li>
							<span className="font-medium text-red-700">Denied</span> — any
							other destination is rejected outright (no matching ALLOW policy).
						</li>
						<li>
							<span className="font-medium text-gray-700">Self-delete</span> —
							agent deletes its own user (Policy C). Run after testing to clean
							up, or to simulate key compromise self-remediation.
						</li>
					</ul>
					{walletAddress && (
						<div className="mt-1 rounded border border-blue-100 bg-blue-50 px-3 py-2 text-blue-800 text-xs">
							Fund your wallet with Sepolia ETH before running the agent.{" "}
							<a
								className="underline"
								href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
								rel="noopener noreferrer"
								target="_blank"
							>
								Get Sepolia ETH
							</a>
							<br />
							Wallet address:{" "}
							<span className="break-all font-mono">{walletAddress}</span>
						</div>
					)}
				</section>

				{/* CLI commands */}
				{walletAddress && orgId ? (
					<section className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
						<h2 className="font-semibold text-gray-800 text-sm">
							Agent CLI commands
						</h2>
						<p className="text-gray-500 text-xs">
							Run one of these in a second terminal. The webhook delivers the
							event here via SSE.
						</p>
						<div className="space-y-2">
							<div>
								<div className="mb-1 font-medium text-[10px] text-green-700 uppercase tracking-wide">
									Allowed — completes immediately
								</div>
								<CopyBlock
									value={`pnpm agent allowed ${walletAddress} ${orgId}`}
								/>
							</div>
							<div>
								<div className="mb-1 font-medium text-[10px] text-yellow-700 uppercase tracking-wide">
									Requires approval — approve below
								</div>
								<CopyBlock
									value={`pnpm agent approval ${walletAddress} ${orgId}`}
								/>
							</div>
							<div>
								<div className="mb-1 font-medium text-[10px] text-red-700 uppercase tracking-wide">
									Denied — rejected by policy
								</div>
								<CopyBlock
									value={`pnpm agent denied ${walletAddress} ${orgId}`}
								/>
							</div>
							<div>
								<div className="mb-1 font-medium text-[10px] text-gray-500 uppercase tracking-wide">
									Self-delete — agent removes itself (policy C)
								</div>
								<CopyBlock
									value={`pnpm agent self-delete ${walletAddress} ${orgId}`}
								/>
							</div>
						</div>
					</section>
				) : (
					<section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
						<p className="text-gray-500 text-sm">Loading wallet address…</p>
					</section>
				)}

				{/* Activity log */}
				<section className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
					<div className="flex items-center justify-between">
						<h2 className="font-semibold text-gray-800 text-sm">
							Activity log
						</h2>
						<span className="text-gray-400 text-xs">
							SSE live — {events.length} event{events.length !== 1 && "s"}
						</span>
					</div>

					{events.length === 0 ? (
						<p className="text-gray-400 text-xs">
							No events yet. Run an agent command above.
						</p>
					) : (
						<div
							className="max-h-112 space-y-2 overflow-y-auto pr-1"
							ref={logRef}
						>
							{events.map((ev) => {
								const needsApproval =
									ev.payload.status === "ACTIVITY_STATUS_CONSENSUS_NEEDED" &&
									ev.payload.canApprove &&
									!isTerminal(ev.payload.status) &&
									!approvalResults[ev.payload.id];

								// Check if a newer event for same activity ID has reached terminal state
								const hasTerminalSibling = events.some(
									(e) =>
										e.payload.id === ev.payload.id &&
										isTerminal(e.payload.status)
								);

								return (
									<div
										className="space-y-1.5 rounded border border-gray-100 bg-gray-50 p-3 text-xs"
										key={ev.id}
									>
										<div className="flex flex-wrap items-center gap-2">
											{statusBadge(ev.payload.status)}
											<span className="text-gray-400">
												{new Date(ev.receivedAt).toLocaleTimeString()}
											</span>
											{needsApproval && !hasTerminalSibling && (
												<button
													className="rounded bg-blue-600 px-2 py-0.5 font-medium text-[10px] text-white hover:bg-blue-700 disabled:opacity-50"
													disabled={approvingId === ev.payload.id}
													onClick={async () => {
														await handleApprove(
															ev.payload.fingerprint,
															ev.payload.id,
															ev.payload.organizationId
														);
													}}
													type="button"
												>
													{approvingId === ev.payload.id
														? "Approving…"
														: "Approve"}
												</button>
											)}
										</div>
										<div className="break-all font-mono text-gray-500">
											{ev.payload.id}
										</div>
										<div className="text-gray-400">
											{ev.payload.type?.replace("ACTIVITY_TYPE_", "")}
										</div>
										{approvalResults[ev.payload.id] &&
											ev.payload.status !==
												"ACTIVITY_STATUS_CONSENSUS_NEEDED" && (
												<div className="break-all font-mono">
													{renderApprovalResult(approvalResults[ev.payload.id])}
												</div>
											)}
									</div>
								);
							})}
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
