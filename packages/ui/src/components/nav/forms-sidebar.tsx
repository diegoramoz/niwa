"use client";

import { SiGithub } from "@icons-pack/react-simple-icons";
import { APP } from "@oss/shared/metadata";
import { Item, ItemGroup, ItemMedia } from "@oss/ui/components/item";
import {
	WireframeSidebar,
	WireframeSidebarContent,
	WireframeSidebarFooter,
	WireframeSidebarHeader,
} from "@oss/ui/components/wireframe";
import { isRouteActive } from "@oss/ui/hooks/use-nav-routes";
import { cn } from "@oss/ui/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FORMS_NAV } from "./forms";

export function FormsSidebar() {
	const pathname = usePathname();

	return (
		<WireframeSidebar
			className="border-r bg-background"
			hide="mobile"
			position="left"
		>
			<WireframeSidebarHeader className="p-3">
				<div className="px-3 py-2">
					<Link
						className="mb-2 flex items-center gap-1 text-muted-foreground text-xs hover:text-foreground"
						href="/"
					>
						<ArrowLeft className="size-3" />
						Home
					</Link>
					<p className="font-semibold text-sm">Forms</p>
					<p className="text-muted-foreground text-xs">Component examples</p>
				</div>
			</WireframeSidebarHeader>

			<WireframeSidebarContent className="p-3">
				<nav className="flex flex-col gap-1">
					<ItemGroup>
						{FORMS_NAV.map((item) => {
							const isActive = isRouteActive(pathname, item.activePatterns);
							return (
								<Item
									className={cn(
										"hover:bg-muted",
										isActive && "bg-muted font-medium"
									)}
									key={item.href}
									render={<Link href={item.href} />}
									size="sm"
								>
									<ItemMedia variant="icon">
										<item.icon
											className={cn(
												"size-4",
												isActive ? "text-foreground" : "text-muted-foreground"
											)}
										/>
									</ItemMedia>
									<span
										className={cn(
											"text-sm",
											isActive ? "text-foreground" : "text-muted-foreground"
										)}
									>
										{item.name}
									</span>
								</Item>
							);
						})}
					</ItemGroup>
				</nav>
			</WireframeSidebarContent>

			<WireframeSidebarFooter className="p-3">
				<a
					className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href={APP.github.url}
					rel="noopener noreferrer"
					target="_blank"
				>
					<SiGithub className="size-4 shrink-0" />
					<span>View on GitHub</span>
				</a>
			</WireframeSidebarFooter>
		</WireframeSidebar>
	);
}
