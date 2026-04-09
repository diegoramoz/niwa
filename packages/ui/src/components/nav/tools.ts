import { ReceiptIcon } from "lucide-react";

export const TOOLS_NAV = [
	{
		name: "Invoice Tracker",
		description: "Extract and record expenses from PDF and image invoices.",
		href: "/tools/invoice",
		icon: ReceiptIcon,
		activePatterns: ["/tools/invoice", "/tools/invoice/*"],
	},
] as const;
