"use client";

import type { DidDocument } from "agentcommercekit";
import { ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

type OwnerArtifacts = {
	did: string;
	didDocument: DidDocument;
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

export default function DemoPage() {
	const [loading, setLoading] = useState(false);
	const [owner, setOwner] = useState<OwnerArtifacts | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function handleInitialise() {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/demo/session", { method: "POST" });
			if (!res.ok) {
				throw new Error(`Server error: ${res.status}`);
			}
			const data = (await res.json()) as OwnerArtifacts;
			setOwner(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
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
					Step 1 — Create Client Owner
				</h1>
				<p className="text-muted-foreground text-sm leading-relaxed">
					An <strong>Owner</strong> is the human or legal entity ultimately
					responsible for an agent&apos;s actions. We start by generating a
					keypair and deriving a <strong>Decentralized Identifier (DID)</strong>{" "}
					— a self-sovereign identifier that no central authority controls. The
					associated <strong>DID Document</strong> publishes the owner&apos;s
					public keys so others can verify their signatures.
				</p>
			</div>

			{/* Action */}
			{!owner && (
				<button
					className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={loading}
					onClick={handleInitialise}
					type="button"
				>
					{loading ? (
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

			{error && (
				<p className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
					{error}
				</p>
			)}

			{/* Artifacts */}
			{owner && (
				<section
					aria-label="client owner artifacts"
					className="space-y-6 rounded-lg border p-6"
				>
					<div className="flex items-center gap-2">
						<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 font-bold text-green-700 text-xs">
							✓
						</span>
						<p className="font-semibold">Client Owner created</p>
					</div>

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
				</section>
			)}
		</main>
	);
}
