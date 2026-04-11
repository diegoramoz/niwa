import "@/utils/orpc.server";
import { orpc } from "@/utils/orpc";
import { PingCard } from "./ping-card";

export const dynamic = "force-dynamic";

export default async function PingPage() {
	const initial = await orpc.ping.ping();

	return (
		<main className="mx-auto max-w-2xl px-4 py-8">
			<div className="mb-6">
				<h1 className="font-bold text-2xl">Cloudflare Tunnel — Ping</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Tests the connection from this deployed app to your local machine via
					a Cloudflare Tunnel.
				</p>
			</div>

			<PingCard initial={initial} />
		</main>
	);
}
