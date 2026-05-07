"use client";

import { ChevronRight, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { ArtifactBlock } from "./artifact-block";
import { StepCard } from "./step-card";
import type { ChatResult, VerifyResult } from "./types";

/**
 * Step 7: Verified interaction gate with haiku fulfillment.
 * Shows the blocked state, the DID exchange, and the fulfilled haiku.
 */
export function InteractionGateStep() {
	const [blockedResult, setBlockedResult] = useState<ChatResult | null>(null);
	const [blockedLoading, setBlockedLoading] = useState(false);

	const [verifyLoading, setVerifyLoading] = useState(false);
	const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
	const [verifyError, setVerifyError] = useState<string | null>(null);

	const [chatMessage, setChatMessage] = useState("Write me a haiku");
	const [chatLoading, setChatLoading] = useState(false);
	const [chatResult, setChatResult] = useState<ChatResult | null>(null);
	const [chatError, setChatError] = useState<string | null>(null);

	async function handleAttemptBlocked() {
		setBlockedLoading(true);
		setBlockedResult(null);
		try {
			const res = await fetch("/api/agents/server/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: chatMessage || "Write me a haiku" }),
			});
			const data = (await res.json()) as ChatResult;
			setBlockedResult(data);
		} catch (err) {
			setBlockedResult({
				blocked: true,
				reason: err instanceof Error ? err.message : "Unknown error",
			});
		} finally {
			setBlockedLoading(false);
		}
	}

	async function handleVerify() {
		setVerifyLoading(true);
		setVerifyError(null);
		setVerifyResult(null);
		setChatResult(null);
		try {
			const res = await fetch("/api/interact", { method: "POST" });
			const data = (await res.json()) as VerifyResult & { error?: string };
			if (!res.ok) {
				throw new Error(data.error ?? `Server error: ${res.status}`);
			}
			setVerifyResult(data);
		} catch (err) {
			setVerifyError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setVerifyLoading(false);
		}
	}

	async function handleChat() {
		setChatLoading(true);
		setChatError(null);
		setChatResult(null);
		try {
			const res = await fetch("/api/agents/server/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: chatMessage || "Write me a haiku" }),
			});
			const data = (await res.json()) as ChatResult;
			if (res.status !== 403 && !res.ok) {
				const errBody = data as unknown as { error?: string };
				throw new Error(errBody.error ?? `Server error: ${res.status}`);
			}
			setChatResult(data);
		} catch (err) {
			setChatError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setChatLoading(false);
		}
	}

	const isDone = !!chatResult && !chatResult.blocked;

	return (
		<StepCard done={isDone} number={7} title="Verified Interaction Gate">
			<p className="text-muted-foreground text-sm leading-relaxed">
				The server agent refuses to fulfill requests until the client&apos;s
				identity is confirmed. This step demonstrates the full protocol: a
				blocked attempt, a mutual <strong>DID exchange</strong> and{" "}
				<strong>VC verification</strong>, and then successful fulfillment with a
				haiku.
			</p>

			<div className="space-y-3 rounded-md border p-4">
				<p className="font-medium text-sm">
					A - Attempt chat before verification
				</p>
				<p className="text-muted-foreground text-xs">
					Send a chat message to the server agent before identity has been
					verified. The server should refuse.
				</p>
				<div className="flex items-center gap-2">
					<input
						className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
						onChange={(e) => setChatMessage(e.target.value)}
						placeholder="Write me a haiku"
						type="text"
						value={chatMessage}
					/>
					<button
						className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 font-medium text-sm transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={blockedLoading}
						onClick={handleAttemptBlocked}
						type="button"
					>
						{blockedLoading ? (
							<Loader2 className="h-3.5 w-3.5 animate-spin" />
						) : (
							<ChevronRight className="h-3.5 w-3.5" />
						)}
						Send (pre-verification)
					</button>
				</div>

				{blockedResult && (
					<div className="space-y-2">
						{blockedResult.blocked ? (
							<div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
								<ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
								<div>
									<p className="font-medium text-amber-800 text-xs">
										Request blocked
									</p>
									<p className="text-amber-700 text-xs">
										{blockedResult.reason}
									</p>
								</div>
							</div>
						) : (
							<ArtifactBlock label="Response">
								{JSON.stringify(blockedResult, null, 2)}
							</ArtifactBlock>
						)}
					</div>
				)}
			</div>

			<div className="space-y-3 rounded-md border p-4">
				<p className="font-medium text-sm">
					B - Mutual DID exchange and VC verification
				</p>
				<p className="text-muted-foreground text-xs">
					Both agents exchange ownership VCs. Each verifies that the other
					agent&apos;s controller credential is valid and signed by a trusted
					owner. Only after mutual verification does the gate open.
				</p>
				{!verifyResult && (
					<button
						className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={verifyLoading}
						onClick={handleVerify}
						type="button"
					>
						{verifyLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Verifying...
							</>
						) : (
							<>
								<ShieldCheck className="h-4 w-4" />
								Run identity verification
							</>
						)}
					</button>
				)}

				{verifyError && (
					<p className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
						{verifyError}
					</p>
				)}

				{verifyResult && (
					<div className="space-y-3">
						<span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 text-xs">
							<ShieldCheck className="h-3.5 w-3.5" />
							Identity verified
						</span>
						<ArtifactBlock label="Verification log">
							{verifyResult.log.join("\n")}
						</ArtifactBlock>
						<button
							className="text-muted-foreground text-xs underline transition-colors hover:text-foreground"
							onClick={handleVerify}
							type="button"
						>
							Re-run verification
						</button>
					</div>
				)}
			</div>

			{verifyResult?.verified && (
				<div className="space-y-3 rounded-md border p-4">
					<p className="font-medium text-sm">
						C - Fulfilled request after verification
					</p>
					<p className="text-muted-foreground text-xs">
						Now that identity is confirmed, the server agent fulfills the
						request and responds with a haiku.
					</p>
					{!chatResult && (
						<button
							className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={chatLoading}
							onClick={handleChat}
							type="button"
						>
							{chatLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Sending...
								</>
							) : (
								<>
									<ChevronRight className="h-4 w-4" />
									Send chat (post-verification)
								</>
							)}
						</button>
					)}

					{chatError && (
						<p className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
							{chatError}
						</p>
					)}

					{chatResult && (
						<div className="space-y-4">
							{chatResult.blocked ? (
								<div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
									<ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
									<p className="text-amber-700 text-xs">{chatResult.reason}</p>
								</div>
							) : (
								<>
									<span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 text-xs">
										<ShieldCheck className="h-3.5 w-3.5" />
										Fulfilled
									</span>
									<ArtifactBlock label="Haiku response">
										{chatResult.haiku}
									</ArtifactBlock>
								</>
							)}
							<button
								className="text-muted-foreground text-xs underline transition-colors hover:text-foreground"
								onClick={handleChat}
								type="button"
							>
								Send again
							</button>
						</div>
					)}
				</div>
			)}
		</StepCard>
	);
}
