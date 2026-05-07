"use client";

import { ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { useIdentityFlow } from "./_state/use-identity-flow";

import { ArtifactBlock } from "./artifact-block";
import { InteractionGateStep } from "./interaction-gate-step";
import { StepCard } from "./step-card";

/**
 * Steps 4-7: server owner, server agent, server ownership VC issuance,
 * and the verified interaction gate.
 */
export function ServerSetupSteps() {
	const {
		setup,
		requests,
		createServerOwner,
		createServerOwnerLoading,
		createServerAgent,
		createServerAgentLoading,
		issueServerVc,
		issueServerVcLoading,
		showInteractionGate,
	} = useIdentityFlow();

	const serverOwner = setup.serverOwner;
	const serverAgent = setup.serverAgent;
	const serverVc = setup.serverVc;

	const serverOwnerError =
		requests.createServerOwner.status === "error"
			? requests.createServerOwner.error
			: null;
	const serverAgentError =
		requests.createServerAgent.status === "error"
			? requests.createServerAgent.error
			: null;
	const serverVcError =
		requests.issueServerVc.status === "error"
			? requests.issueServerVc.error
			: null;

	return (
		<>
			<StepCard done={!!serverOwner} number={4} title="Create Server Owner">
				<p className="text-muted-foreground text-sm leading-relaxed">
					The server side of the ACK identity interaction also has an owner -
					the entity responsible for the server agent. A separate keypair
					derives an independent <strong>DID</strong> that identifies this
					counterparty.
				</p>

				{!serverOwner && (
					<button
						className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={createServerOwnerLoading}
						onClick={createServerOwner}
						type="button"
					>
						{createServerOwnerLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Generating...
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
							disabled={createServerOwnerLoading}
							onClick={createServerOwner}
							type="button"
						>
							Re-generate
						</button>
					</div>
				)}
			</StepCard>

			{serverOwner && (
				<StepCard done={!!serverAgent} number={5} title="Create Server Agent">
					<p className="text-muted-foreground text-sm leading-relaxed">
						The server agent acts on behalf of the server owner. Its{" "}
						<strong>DID document</strong> includes service endpoints under the{" "}
						<code>/api/agents/server/</code> namespace - the server-side
						counterpart to the client agent&apos;s protocol surfaces.
					</p>

					{!serverAgent && (
						<button
							className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={createServerAgentLoading}
							onClick={createServerAgent}
							type="button"
						>
							{createServerAgentLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Generating...
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
								disabled={createServerAgentLoading}
								onClick={createServerAgent}
								type="button"
							>
								Re-generate
							</button>
						</div>
					)}
				</StepCard>
			)}

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
						<code>/api/agents/server/identity/vc</code> protocol endpoint,
						enabling mutual identity verification.
					</p>

					{!serverVc && (
						<button
							className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={issueServerVcLoading}
							onClick={issueServerVc}
							type="button"
						>
							{issueServerVcLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Issuing...
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
								disabled={issueServerVcLoading}
								onClick={issueServerVc}
								type="button"
							>
								Re-issue
							</button>
						</div>
					)}
				</StepCard>
			)}

			{showInteractionGate && <InteractionGateStep />}
		</>
	);
}
