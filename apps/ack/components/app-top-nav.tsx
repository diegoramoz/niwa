"use client";

import { WireframeNav } from "@oss/ui/components/wireframe";
import { useNavRoutes } from "@oss/ui/hooks/use-nav-routes";
import { cn } from "@oss/ui/lib/utils";
import Link from "next/link";
import { DEMO_NAV_ROUTES } from "@/config/nav";

export function AppTopNav() {
	const routes = useNavRoutes(DEMO_NAV_ROUTES);

	return (
		<WireframeNav
			className="hidden items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:flex"
			hideOn="mobile"
			position="top"
		>
			<div className="flex min-w-0 items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted font-semibold text-sm">
					ACK
				</div>
				<div className="min-w-0">
					<p className="truncate font-semibold text-sm">Agent Commerce Kit</p>
					<p className="truncate text-muted-foreground text-xs">
						Demo navigation
					</p>
				</div>
			</div>

			<nav
				aria-label="Demo navigation"
				className="flex h-full items-center gap-1"
			>
				{routes.map((route) => (
					<Link
						aria-current={route.isActive ? "page" : undefined}
						className={cn(
							"flex h-full items-center gap-2 rounded-md px-3 py-2 font-medium text-sm transition-colors",
							route.isActive
								? "bg-muted text-foreground"
								: "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
						)}
						href={route.href}
						key={route.href}
					>
						<route.icon className="size-4" />
						<span>{route.name}</span>
					</Link>
				))}
			</nav>
		</WireframeNav>
	);
}
