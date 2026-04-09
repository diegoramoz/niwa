"use client";

import { Navigation } from "@oss/ui/components/nav/navigation";
import { USER_NAV_ROUTES } from "@/components/nav";

export function Navbar() {
	return <Navigation routes={USER_NAV_ROUTES} />;
}
