import type { NavRoute } from "@oss/ui/hooks/use-nav-routes";
import {
	BadgeCheckIcon,
	BotMessageSquareIcon,
	CreditCardIcon,
	ShieldCheckIcon,
	WaypointsIcon,
} from "lucide-react";

export const DEMO_NAV_ROUTES = [
	{
		href: "/identity",
		name: "Identity",
		icon: ShieldCheckIcon,
		activePatterns: ["/identity", "/identity/*"],
	},
	{
		href: "/identity-a2a",
		name: "Identity A2A",
		icon: BotMessageSquareIcon,
		activePatterns: ["/identity-a2a", "/identity-a2a/*"],
	},
	{
		href: "/payments",
		name: "Payments",
		icon: CreditCardIcon,
		activePatterns: ["/payments", "/payments/*"],
	},
	{
		href: "/skyfire-kya",
		name: "Skyfire KYA",
		icon: BadgeCheckIcon,
		activePatterns: ["/skyfire-kya", "/skyfire-kya/*"],
	},
	{
		href: "/e2e",
		name: "End-to-End",
		icon: WaypointsIcon,
		activePatterns: ["/e2e", "/e2e/*"],
	},
] as const satisfies readonly NavRoute[];
