import type { NavRoute } from "@oss/ui/hooks/use-nav-routes";
import { HomeIcon } from "lucide-react";

export const USER_NAV_ROUTES = [
	{
		href: "/dashboard",
		name: "Dashboard",
		icon: HomeIcon,
		activePatterns: ["/dashboard"],
	},
] as const satisfies readonly NavRoute[];
