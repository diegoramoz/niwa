"use client";

import type { DidDocument } from "agentcommercekit";
import { ChevronRight, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";

type IdentityArtifacts = {
	did: string;
	didDocument: DidDocument;
};

type VcArtifacts = {
	jwt: string;
	verified: boolean;
	verificationError: string | null;
};

type VerifyResult = {
	verified: boolean;
	log: string[];
};

type ChatResult = {
	blocked?: boolean;
	reason?: string;
	message?: string;
	haiku?: string;
};

function ArtifactBlock({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-1">
			<p className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
				{label}
			</p>
			<pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-xs leading-relaxed">
				{children}
			</pre>
		</div>
	);
}

function StepCard({
	number,
	title,
	done,
	children,
}: {
	number: number;
	title: string;
	done: boolean;
	children: React.ReactNode;
}) {
	return (
		<section aria-label={title} className="space-y-6 rounded-lg border p-6">
			<div className="flex items-center gap-3">
				<span
					className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs ${
						done
							? "bg-green-100 text-green-700"
							: "bg-muted text-muted-foreground"
					}`}
				>
					{done ? "✓" : number}
				</span>
				<p className="font-semibold">{title}</p>
			</div>
			{children}
		</section>
	);
}

/**
 * Step 7: Verified interaction gate with haiku fulfillment.
 * Shows the blocked state, the DID exchange, and the fulfilled haiku.
 */
function InteractionGateStep() {
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
			const res = await fetch("/api/demo/agents/server/chat", {
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
			const res = await fetch("/api/demo/interact", { method: "POST" });
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
			const res = await fetch("/api/demo/agents/server/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: chatMessage || "Write me a haiku" }),
			});
			const data = (await res.json()) as ChatResult;
			// A 403 with `blocked: true` is an expected "gate closed" state — render it.
			// Any other non-OK response is an unexpected error.
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

			{/* Sub-step A: show blocked state */}
			<div className="space-y-3 rounded-md border p-4">
				<p className="font-medium text-sm">
					A — Attempt chat before verification
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

			{/* Sub-step B: mutual DID exchange */}
			<div className="space-y-3 rounded-md border p-4">
				<p className="font-medium text-sm">
					B — Mutual DID exchange and VC verification
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
								Verifying…
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

			{/* Sub-step C: fulfilled chat after verification */}
			{verifyResult?.verified && (
				<div className="space-y-3 rounded-md border p-4">
					<p className="font-medium text-sm">
						C — Fulfilled request after verification
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
									Sending…
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

/**
 * Steps 4–7: server owner, server agent, server ownership VC issuance,
 * and the verified interaction gate.
 */
function ServerSetupSteps() {
	const [serverOwnerLoading, setServerOwnerLoading] = useState(false);
	const [serverOwner, setServerOwner] = useState<IdentityArtifacts | null>(
		null
	);
	const [serverOwnerError, setServerOwnerError] = useState<string | null>(null);

	const [serverAgentLoading, setServerAgentLoading] = useState(false);
	const [serverAgent, setServerAgent] = useState<IdentityArtifacts | null>(
		null
	);
	const [serverAgentError, setServerAgentError] = useState<string | null>(null);

	const [serverVcLoading, setServerVcLoading] = useState(false);
	const [serverVc, setServerVc] = useState<VcArtifacts | null>(null);
	const [serverVcError, setServerVcError] = useState<string | null>(null);

	async function handleCreateServerOwner() {
		setServerOwnerLoading(true);
		setServerOwnerError(null);
		setServerOwner(null);
		setServerAgent(null);
		try {
			const res = await fetch("/api/demo/owners/server", { method: "POST" });
			if (!res.ok) {
				const body = (await res.json()) as { error?: string };
				throw new Error(body.error ?? `Server error: ${res.status}`);
			}
			const data = (await res.json()) as IdentityArtifacts;
			setServerOwner(data);
		} catch (err) {
			setServerOwnerError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setServerOwnerLoading(false);
		}
	}

	async function handleCreateServerAgent() {
		setServerAgentLoading(true);
		setServerAgentError(null);
		setServerAgent(null);
		setServerVc(null);
		try {
			const res = await fetch("/api/demo/agents/server", { method: "POST" });
			if (!res.ok) {
				const body = (await res.json()) as { error?: string };
				throw new Error(body.error ?? `Server error: ${res.status}`);
			}
			const data = (await res.json()) as IdentityArtifacts;
			setServerAgent(data);
		} catch (err) {
			setServerAgentError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setServerAgentLoading(false);
		}
	}

	async function handleIssueServerVC() {
		setServerVcLoading(true);
		setServerVcError(null);
		setServerVc(null);
		try {
			const res = await fetch("/api/demo/vc/issue/server", { method: "POST" });
			if (!res.ok) {
				const body = (await res.json()) as { error?: string };
				throw new Error(body.error ?? `Server error: ${res.status}`);
			}
			const data = (await res.json()) as VcArtifacts;
			setServerVc(data);
		} catch (err) {
			setServerVcError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setServerVcLoading(false);
		}
	}

	return (
		<>
			{/* Step 4 — Server Owner */}
			<StepCard done={!!serverOwner} number={4} title="Create Server Owner">
				<p className="text-muted-foreground text-sm leading-relaxed">
					The server side of the ACK identity interaction also has an owner —
					the entity responsible for the server agent. A separate keypair
					derives an independent <strong>DID</strong> that identifies this
					counterparty.
				</p>

				{!serverOwner && (
					<button
						className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={serverOwnerLoading}
						onClick={handleCreateServerOwner}
						type="button"
					>
						{serverOwnerLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Generating…
							</>
						) : (
							<>
								<ChevronRight className="h-4 w-4" />
								Create server owner
							</>
						)}
					</button>
				)}

				{serverOwnerError && (
					<p className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
						{serverOwnerError}
					</p>
				)}

				{serverOwner && (
					<div className="space-y-4">
						<ArtifactBlock label="Server Owner DID">
							{serverOwner.did}
						</ArtifactBlock>
						<ArtifactBlock label="DID Document">
							{JSON.stringify(serverOwner.didDocument, null, 2)}
						</ArtifactBlock>
						<button
							className="text-muted-foreground text-xs underline transition-colors hover:text-foreground"
							onClick={handleCreateServerOwner}
							type="button"
						>
							Re-generate
						</button>
					</div>
				)}
			</StepCard>

			{/* Step 5 — Server Agent (unlocked after Step 4) */}
			{serverOwner && (
				<StepCard done={!!serverAgent} number={5} title="Create Server Agent">
					<p className="text-muted-foreground text-sm leading-relaxed">
						The server agent acts on behalf of the server owner. Its{" "}
						<strong>DID document</strong> includes service endpoints under the{" "}
						<code>/api/demo/agents/server/</code> namespace — the server-side
						counterpart to the client agent&apos;s protocol surfaces.
					</p>

					{!serverAgent && (
						<button
							className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={serverAgentLoading}
							onClick={handleCreateServerAgent}
							type="button"
						>
							{serverAgentLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Generating…
								</>
							) : (
								<>
									<ChevronRight className="h-4 w-4" />
									Create server agent
								</>
							)}
						</button>
					)}

					{serverAgentError && (
						<p className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
							{serverAgentError}
						</p>
					)}

					{serverAgent && (
						<div className="space-y-4">
							<ArtifactBlock label="Server Agent DID">
								{serverAgent.did}
							</ArtifactBlock>
							<ArtifactBlock label="DID Document">
								{JSON.stringify(serverAgent.didDocument, null, 2)}
							</ArtifactBlock>
							<button
								className="text-muted-foreground text-xs underline transition-colors hover:text-foreground"
								onClick={handleCreateServerAgent}
								type="button"
							>
								Re-generate
							</button>
						</div>
					)}
				</StepCard>
			)}

			{/* Step 6 — Issue Server Ownership VC (unlocked after Step 5) */}
			{serverAgent && (
				<StepCard
					done={!!serverVc}
					number={6}
					title="Issue Server Ownership Credential"
				>
					<p className="text-muted-foreground text-sm leading-relaxed">
						The server owner signs a <strong>ControllerCredential</strong> that
						attests they control the server agent. This credential is issued as
						a signed JWT and served from the{" "}
						<code>/api/demo/agents/server/identity/vc</code> protocol endpoint,
						enabling mutual identity verification.
					</p>

					{!serverVc && (
						<button
							className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={serverVcLoading}
							onClick={handleIssueServerVC}
							type="button"
						>
							{serverVcLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Issuing…
								</>
							) : (
								<>
									<ChevronRight className="h-4 w-4" />
									Issue server ownership credential
								</>
							)}
						</button>
					)}

					{serverVcError && (
						<p className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
							{serverVcError}
						</p>
					)}

					{serverVc && (
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								{serverVc.verified ? (
									<span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 text-xs">
										<ShieldCheck className="h-3.5 w-3.5" />
										Verified
									</span>
								) : (
									<span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 font-medium text-red-700 text-xs">
										Verification failed
									</span>
								)}
								{serverVc.verificationError && (
									<span className="text-muted-foreground text-xs">
										{serverVc.verificationError}
									</span>
								)}
							</div>
							<ArtifactBlock label="Server Ownership VC (JWT)">
								{serverVc.jwt}
							</ArtifactBlock>
							<button
								className="text-muted-foreground text-xs underline transition-colors hover:text-foreground"
								onClick={handleIssueServerVC}
								type="button"
							>
								Re-issue
							</button>
						</div>
					)}
				</StepCard>
			)}

			{/* Step 7 — Interaction gate (unlocked after Step 6) */}
			{serverVc && <InteractionGateStep />}
		</>
	);
}

export default function DemoPage() {
	const [ownerLoading, setOwnerLoading] = useState(false);
	const [owner, setOwner] = useState<IdentityArtifacts | null>(null);
	const [ownerError, setOwnerError] = useState<string | null>(null);

	const [agentLoading, setAgentLoading] = useState(false);
	const [agent, setAgent] = useState<IdentityArtifacts | null>(null);
	const [agentError, setAgentError] = useState<string | null>(null);

	const [vcLoading, setVcLoading] = useState(false);
	const [vc, setVc] = useState<VcArtifacts | null>(null);
	const [vcError, setVcError] = useState<string | null>(null);

	async function handleInitialise() {
		setOwnerLoading(true);
		setOwnerError(null);
		setOwner(null);
		setAgent(null);
		setVc(null);
		try {
			const res = await fetch("/api/demo/session", { method: "POST" });
			if (!res.ok) {
				throw new Error(`Server error: ${res.status}`);
			}
			const data = (await res.json()) as IdentityArtifacts;
			setOwner(data);
		} catch (err) {
			setOwnerError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setOwnerLoading(false);
		}
	}

	async function handleCreateAgent() {
		setAgentLoading(true);
		setAgentError(null);
		setVc(null);
		try {
			const res = await fetch("/api/demo/agents/client", { method: "POST" });
			if (!res.ok) {
				const body = (await res.json()) as { error?: string };
				throw new Error(body.error ?? `Server error: ${res.status}`);
			}
			const data = (await res.json()) as IdentityArtifacts;
			setAgent(data);
		} catch (err) {
			setAgentError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setAgentLoading(false);
		}
	}

	async function handleIssueVC() {
		setVcLoading(true);
		setVcError(null);
		setVc(null);
		try {
			const res = await fetch("/api/demo/vc/issue", { method: "POST" });
			if (!res.ok) {
				const body = (await res.json()) as { error?: string };
				throw new Error(body.error ?? `Server error: ${res.status}`);
			}
			const data = (await res.json()) as VcArtifacts;
			setVc(data);
		} catch (err) {
			setVcError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setVcLoading(false);
		}
	}

	return (
		<main className="mx-auto max-w-2xl space-y-8 px-4 py-16">
			{/* Header */}
			<div className="space-y-2">
				<div className="flex items-center gap-2 font-medium text-indigo-500 text-sm">
					<ShieldCheck className="h-4 w-4" />
					ACK Identity Demo
				</div>
				<h1 className="font-bold text-2xl tracking-tight">
					Guided Identity Flow
				</h1>
				<p className="text-muted-foreground text-sm leading-relaxed">
					Walk through the ACK identity protocol step by step. Each step creates
					or exchanges identity artifacts that are rendered here for inspection.
				</p>
			</div>

			{/* Step 1 — Client Owner */}
			<StepCard done={!!owner} number={1} title="Create Client Owner">
				<p className="text-muted-foreground text-sm leading-relaxed">
					An owner is the human or legal entity responsible for an agent&apos;s
					actions. Generating a keypair derives a{" "}
					<strong>Decentralized Identifier (DID)</strong> — a self-sovereign
					identifier anchored to no central authority.
				</p>

				{!owner && (
					<button
						className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={ownerLoading}
						onClick={handleInitialise}
						type="button"
					>
						{ownerLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Generating…
							</>
						) : (
							<>
								<ChevronRight className="h-4 w-4" />
								Initialise demo session
							</>
						)}
					</button>
				)}

				{ownerError && (
					<p className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
						{ownerError}
					</p>
				)}

				{owner && (
					<div className="space-y-4">
						<ArtifactBlock label="Owner DID">{owner.did}</ArtifactBlock>
						<ArtifactBlock label="DID Document">
							{JSON.stringify(owner.didDocument, null, 2)}
						</ArtifactBlock>
						<button
							className="text-muted-foreground text-xs underline transition-colors hover:text-foreground"
							onClick={handleInitialise}
							type="button"
						>
							Re-generate
						</button>
					</div>
				)}
			</StepCard>

			{/* Step 2 — Client Agent (unlocked after Step 1) */}
			{owner && (
				<StepCard done={!!agent} number={2} title="Create Client Agent">
					<p className="text-muted-foreground text-sm leading-relaxed">
						An <strong>Agent</strong> acts on behalf of its owner. The
						agent&apos;s DID document includes{" "}
						<strong>service endpoints</strong> that map to the namespaced
						app-router protocol paths — replacing the separate localhost ports
						used by the original CLI demo.
					</p>

					{!agent && (
						<button
							className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={agentLoading}
							onClick={handleCreateAgent}
							type="button"
						>
							{agentLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Generating…
								</>
							) : (
								<>
									<ChevronRight className="h-4 w-4" />
									Create client agent
								</>
							)}
						</button>
					)}

					{agentError && (
						<p className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
							{agentError}
						</p>
					)}

					{agent && (
						<div className="space-y-4">
							<ArtifactBlock label="Agent DID">{agent.did}</ArtifactBlock>
							<ArtifactBlock label="DID Document">
								{JSON.stringify(agent.didDocument, null, 2)}
							</ArtifactBlock>
							<button
								className="text-muted-foreground text-xs underline transition-colors hover:text-foreground"
								onClick={handleCreateAgent}
								type="button"
							>
								Re-generate
							</button>
						</div>
					)}
				</StepCard>
			)}

			{/* Step 3 — Issue Ownership VC (unlocked after Step 2) */}
			{agent && (
				<StepCard
					done={!!vc}
					number={3}
					title="Issue Client Ownership Credential"
				>
					<p className="text-muted-foreground text-sm leading-relaxed">
						The owner signs a <strong>ControllerCredential</strong> that attests
						they control the agent. The credential is issued as a signed JWT.
						Verification confirms the proof is valid and the issuer is trusted.
					</p>

					{!vc && (
						<button
							className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={vcLoading}
							onClick={handleIssueVC}
							type="button"
						>
							{vcLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Issuing…
								</>
							) : (
								<>
									<ChevronRight className="h-4 w-4" />
									Issue ownership credential
								</>
							)}
						</button>
					)}

					{vcError && (
						<p className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
							{vcError}
						</p>
					)}

					{vc && (
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								{vc.verified ? (
									<span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 text-xs">
										<ShieldCheck className="h-3.5 w-3.5" />
										Verified
									</span>
								) : (
									<span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 font-medium text-red-700 text-xs">
										Verification failed
									</span>
								)}
								{vc.verificationError && (
									<span className="text-muted-foreground text-xs">
										{vc.verificationError}
									</span>
								)}
							</div>
							<ArtifactBlock label="Ownership VC (JWT)">{vc.jwt}</ArtifactBlock>
							<button
								className="text-muted-foreground text-xs underline transition-colors hover:text-foreground"
								onClick={handleIssueVC}
								type="button"
							>
								Re-issue
							</button>
						</div>
					)}
				</StepCard>
			)}

			{/* Steps 4–5 — Server setup (unlocked after Step 3) */}
			{vc && <ServerSetupSteps />}
		</main>
	);
}
