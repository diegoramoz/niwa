import { DemoPlaceholder } from "@/components/demo-placeholder";

export default function PaymentsPage() {
	return (
		<DemoPlaceholder
			command="bun run demo:payments"
			description="Protected resource access with a payment request, payment execution, receipt issuance, and receipt verification."
			title="Payments Demo"
		/>
	);
}
