"use client";

import { WireframeNav } from "@oss/ui/components/wireframe";
import { useNavRoutes } from "@oss/ui/hooks/use-nav-routes";
import { cn } from "@oss/ui/lib/utils";
import Link from "next/link";
import { DEMO_NAV_ROUTES } from "@/config/nav";

export function AppBottomNav() {
	const routes = useNavRoutes(DEMO_NAV_ROUTES);

	return (
		<WireframeNav
			className="flex items-center border-t bg-background/95 px-1 backdrop-blur md:hidden"
			hideOn="desktop"
			position="bottom"
		>
			<nav
				aria-label="Demo navigation"
				className="flex h-full w-full items-center justify-between gap-1"
			>
				{routes.map((route) => (
					<Link
						aria-current={route.isActive ? "page" : undefined}
						className={cn(
							"flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-center text-[10px] transition-colors",
							route.isActive
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground"
						)}
						href={route.href}
						key={route.href}
					>
						<route.icon
							className={cn("size-4", route.isActive && "text-primary")}
						/>
						<span className="line-clamp-2 leading-tight">{route.name}</span>
					</Link>
				))}
			</nav>
		</WireframeNav>
	);
}
