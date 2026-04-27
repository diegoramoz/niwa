import { Wireframe } from "@oss/ui/components/wireframe";
import type { Metadata } from "next";
import { RoutesButton } from "@/components/wireframe/routes-button";

export const metadata: Metadata = {
	title: "App Wireframe",
	description: "App Wireframe",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<Wireframe
			config={{
				corners: {
					bottomLeft: "navbar",
					bottomRight: "navbar",
					topLeft: "navbar",
					topRight: "navbar",
				},
				cssVariables: {
					// STICKY NAV
					"--sticky-nav-height": 12,

					// TOP NAV
					"--top-nav-height": 16,

					// BOTTOM NAV
					"--bottom-nav-height": 8,

					// LEFT SIDEBAR
					"--left-sidebar-width-collapsed": 16,
					"--left-sidebar-width-expanded": 52,

					// RIGHT SIDEBAR
					"--right-sidebar-width-expanded": 52,
					"--right-sidebar-width-collapsed": 16,
				},
			}}
		>
			{children}
			<RoutesButton />
		</Wireframe>
	);
}
