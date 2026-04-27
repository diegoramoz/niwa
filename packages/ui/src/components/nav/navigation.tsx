"use client";

import { DesktopNavbar } from "@oss/ui/components/nav/desktop-navbar";
import { MobileBottomNav } from "@oss/ui/components/nav/mobile-bottom-nav";
import { MobileTopNav } from "@oss/ui/components/nav/mobile-top-nav";
import type { UserMenuProps } from "@oss/ui/components/nav/user-menu";
import { WireframeNav } from "@oss/ui/components/wireframe";
import type { NavRoutes } from "@oss/ui/hooks/use-nav-routes";

export function Navigation({
	routes,
	userMenuProps,
}: {
	routes: NavRoutes;
	userMenuProps?: UserMenuProps;
}) {
	return (
		<>
			{/* Mobile: Top nav with logo only */}
			<WireframeNav hideOn="desktop" position="top">
				<MobileTopNav />
			</WireframeNav>

			{/* Mobile: Bottom nav with icons and user menu */}
			<WireframeNav hideOn="desktop" position="bottom">
				<MobileBottomNav routes={routes} userMenuProps={userMenuProps} />
			</WireframeNav>

			{/* Desktop: Top nav with full navbar */}
			<WireframeNav hideOn="mobile" position="top">
				<DesktopNavbar routes={routes} userMenuProps={userMenuProps} />
			</WireframeNav>
		</>
	);
}
