"use client";

import { Button } from "@oss/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@oss/ui/components/card";
import { useCallback, useState } from "react";
import { orpc } from "@/utils/orpc";

type PingResult = Awaited<ReturnType<typeof orpc.ping.ping>>;

export function PingCard({ initial }: { initial: PingResult }) {
	const [result, setResult] = useState<PingResult>(initial);
	const [loading, setLoading] = useState(false);

	const ping = useCallback(async () => {
		setLoading(true);
		try {
			const data = await orpc.ping.ping();
			setResult(data);
		} finally {
			setLoading(false);
		}
	}, []);

	const isOk = result.ok;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Local machine ping</CardTitle>
				<Button disabled={loading} onClick={ping} size="sm" variant="outline">
					{loading ? "Pinging…" : "Ping again"}
				</Button>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Status badge */}
				<div className="flex items-center gap-2">
					<span
						className={`inline-block h-2.5 w-2.5 rounded-full ${isOk ? "bg-green-500" : "bg-red-500"}`}
					/>
					<span className="font-medium text-sm">
						{isOk ? "Reachable" : "Unreachable"}
					</span>
				</div>

				{/* Raw response */}
				<pre className="overflow-x-auto rounded-md bg-muted p-4 font-mono text-sm leading-relaxed">
					{JSON.stringify(result, null, 2)}
				</pre>

				{/* Explain what happened */}
				<div className="rounded-md border border-dashed p-4 text-muted-foreground text-sm">
					<p className="mb-1 font-medium text-foreground">How this works</p>
					{isOk ? (
						<ol className="list-decimal space-y-1 pl-4">
							<li>
								Your browser called{" "}
								<code className="rounded bg-muted px-1">orpc.ping.ping()</code>{" "}
								→ POST to{" "}
								<code className="rounded bg-muted px-1">/rpc/ping/ping</code>.
							</li>
							<li>
								The Next.js oRPC handler executed the procedure on the server
								and fetched{" "}
								<code className="rounded bg-muted px-1">{result.via}</code>.
							</li>
							<li>
								{"via" in result && result.via.startsWith("https")
									? "That URL is your Cloudflare tunnel. The request travelled: Next.js → Cloudflare edge → cloudflared on your laptop → Bun server."
									: "That URL is localhost — no tunnel yet. Set LOCAL_MACHINE_PING_URL in .env to your tunnel hostname to test the full flow."}
							</li>
							<li>
								Bun responded at{" "}
								<code className="rounded bg-muted px-1">
									{"timestamp" in result ? result.timestamp : "—"}
								</code>
								.
							</li>
						</ol>
					) : (
						<p>
							The oRPC procedure tried to reach{" "}
							<code className="rounded bg-muted px-1">{result.via}</code> but
							got an error. Make sure{" "}
							<code className="rounded bg-muted px-1">bun run start</code> is
							running inside{" "}
							<code className="rounded bg-muted px-1">
								packages/local-machine
							</code>
							.
						</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
