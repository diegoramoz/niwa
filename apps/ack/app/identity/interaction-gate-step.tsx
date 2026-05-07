"use client";

import { ChevronRight, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useIdentityFlow } from "./_state/use-identity-flow";

import { ArtifactBlock } from "./artifact-block";
import { StepCard } from "./step-card";

/**
 * Step 7: Verified interaction gate with haiku fulfillment.
 * Shows the blocked state, the DID exchange, and the fulfilled haiku.
 */
export function InteractionGateStep() {
	const {
		interaction,
		requests,
		setChatMessage,
		attemptBlockedChat,
		verifyIdentity,
		sendChat,
		attemptBlockedChatLoading,
		verifyIdentityLoading,
		sendChatLoading,
	} = useIdentityFlow();

	const blockedResult = interaction.blockedResult;
	const verifyResult = interaction.verifyResult;
	const chatResult = interaction.chatResult;
	const chatMessage = interaction.chatMessage;

	const verifyError =
		requests.verifyIdentity.status === "error"
			? requests.verifyIdentity.error
			: null;
	const chatError =
		requests.sendChat.status === "error" ? requests.sendChat.error : null;

	const chatInputLoading = attemptBlockedChatLoading || sendChatLoading;

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
						disabled={chatInputLoading}
						onChange={(e) => setChatMessage(e.target.value)}
						placeholder="Write me a haiku"
						type="text"
						value={chatMessage}
					/>
					<button
						className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1.5 font-medium text-sm transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={attemptBlockedChatLoading}
						onClick={attemptBlockedChat}
						type="button"
					>
						{attemptBlockedChatLoading ? (
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
						disabled={verifyIdentityLoading}
						onClick={verifyIdentity}
						type="button"
					>
						{verifyIdentityLoading ? (
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
							disabled={verifyIdentityLoading}
							onClick={verifyIdentity}
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
							disabled={sendChatLoading}
							onClick={sendChat}
							type="button"
						>
							{sendChatLoading ? (
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
								disabled={sendChatLoading}
								onClick={sendChat}
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
