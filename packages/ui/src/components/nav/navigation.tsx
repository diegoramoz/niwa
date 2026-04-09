"use client";

import { DesktopNavbar } from "@oss/ui/components/nav/desktop-navbar";
import { MobileBottomNav } from "@oss/ui/components/nav/mobile-bottom-nav";
import { MobileTopNav } from "@oss/ui/components/nav/mobile-top-nav";
import { WireframeNav } from "@oss/ui/components/wireframe";
import type { NavRoutes } from "@oss/ui/hooks/use-nav-routes";

export function Navigation({ routes }: { routes: NavRoutes }) {
	return (
		<>
			{/* Mobile: Top nav with logo only */}
			<WireframeNav hide="desktop" position="top">
				<MobileTopNav />
			</WireframeNav>

			{/* Mobile: Bottom nav with icons and user menu */}
			<WireframeNav hide="desktop" position="bottom">
				<MobileBottomNav routes={routes} />
			</WireframeNav>

			{/* Desktop: Top nav with full navbar */}
			<WireframeNav hide="mobile" position="top">
				<DesktopNavbar routes={routes} />
			</WireframeNav>
		</>
	);
}
