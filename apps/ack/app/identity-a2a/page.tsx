import { DemoPlaceholder } from "@/components/demo-placeholder";

export default function IdentityA2APage() {
	return (
		<DemoPlaceholder
			command="bun run demo:identity-a2a"
			description="Mutual authentication between A2A-compatible agents using ACK-ID DIDs and signed JWT exchanges."
			title="Identity A2A Demo"
		/>
	);
}
