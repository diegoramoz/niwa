"use client";

import { Navigation } from "@oss/ui/components/nav/navigation";
import { ADMIN_NAV_ROUTES, USER_NAV_ROUTES } from "@/config/nav";

export function UserNavigation() {
	return <Navigation routes={USER_NAV_ROUTES} />;
}

export function AdminNavigation() {
	return <Navigation routes={ADMIN_NAV_ROUTES} />;
}
