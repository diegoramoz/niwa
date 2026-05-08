"use client";

import { Wireframe } from "@oss/ui/components/wireframe";
import { AppBottomNav } from "components/app-bottom-nav";
import { AppMobileTopNav } from "components/app-mobile-top-nav";
import { AppSidebar } from "components/app-sidebar";
import { AppTopNav } from "components/app-top-nav";
import { ThemeProvider } from "next-themes";

export default function GlobalLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			disableTransitionOnChange
			enableSystem
		>
			<Wireframe
				config={{
					corners: { topLeft: "navbar", topRight: "navbar" },
				}}
			>
				<AppTopNav />
				<AppMobileTopNav />
				<AppSidebar />
				<AppBottomNav />
				{children}
			</Wireframe>
		</ThemeProvider>
	);
}
