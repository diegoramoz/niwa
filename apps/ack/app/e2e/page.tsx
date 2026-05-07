import { DemoPlaceholder } from "@/components/demo-placeholder";

export default function E2EPage() {
	return (
		<DemoPlaceholder
			command="bun run demo:e2e"
			description="The combined ACK-ID and ACK-Pay flow, from identity establishment through paywall access and receipt-backed fulfillment."
			title="End-to-End Demo"
		/>
	);
}
