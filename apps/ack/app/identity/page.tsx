"use client";

import { ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ArtifactBlock } from "./artifact-block";
import { ServerSetupSteps } from "./server-setup-steps";
import { StepCard } from "./step-card";
import type { IdentityArtifacts, VcArtifacts } from "./types";

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
			const res = await fetch("/api/session", { method: "POST" });
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
			const res = await fetch("/api/agents/client", { method: "POST" });
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
			const res = await fetch("/api/vc/issue", { method: "POST" });
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

			<StepCard done={!!owner} number={1} title="Create Client Owner">
				<p className="text-muted-foreground text-sm leading-relaxed">
					An owner is the human or legal entity responsible for an agent&apos;s
					actions. Generating a keypair derives a{" "}
					<strong>Decentralized Identifier (DID)</strong> - a self-sovereign
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
								Generating...
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

			{owner && (
				<StepCard done={!!agent} number={2} title="Create Client Agent">
					<p className="text-muted-foreground text-sm leading-relaxed">
						An <strong>Agent</strong> acts on behalf of its owner. The
						agent&apos;s DID document includes{" "}
						<strong>service endpoints</strong> that map to the namespaced
						app-router protocol paths - replacing the separate localhost ports
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
									Generating...
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
									Issuing...
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

			{vc && <ServerSetupSteps />}
		</main>
	);
}
