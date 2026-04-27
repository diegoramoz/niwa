"use client";

import { Item, ItemGroup, ItemMedia } from "@oss/ui/components/item";
import {
	WireframeSidebar,
	WireframeSidebarContent,
	// WireframeSidebarFooter,
} from "@oss/ui/components/wireframe";
import { isRouteActive } from "@oss/ui/hooks/use-nav-routes";
import { cn } from "@oss/ui/lib/utils";
import { FORMS_NAV } from "config/forms";
// import { PRIMITIVES_NAV } from "config/primitives";
import {
	// BlocksIcon,
	BookOpenIcon,
	HomeIcon,
	// LayoutGrid,
	// MoonIcon,
	// SunIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useTheme } from "next-themes";

// function ThemeToggle() {
// 	const { resolvedTheme, setTheme } = useTheme();
// 	return (
// 		<button
// 			className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
// 			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
// 			type="button"
// 		>
// 			{resolvedTheme === "dark" ? (
// 				<SunIcon className="size-4 shrink-0" />
// 			) : (
// 				<MoonIcon className="size-4 shrink-0" />
// 			)}
// 			<span>{resolvedTheme === "dark" ? "Light mode" : "Dark mode"}</span>
// 		</button>
// 	);
// }

export function AppSidebar() {
	const pathname = usePathname();

	const inBlog = isRouteActive(pathname, ["/blog", "/blog/*"]);
	const inForms = isRouteActive(pathname, ["/forms", "/forms/*"]);
	// const inPrimitives = isRouteActive(pathname, [
	// 	"/primitives",
	// 	"/primitives/*",
	// ]);

	return (
		<WireframeSidebar
			className="border-r bg-background"
			hideOn="mobile"
			position="left"
		>
			<WireframeSidebarContent className="p-3">
				<nav className="flex flex-col gap-1">
					<ItemGroup>
						<Item
							className={cn(
								"hover:bg-muted",
								pathname === "/" && "bg-muted font-medium"
							)}
							render={<Link href="/" />}
							size="sm"
						>
							<ItemMedia variant="icon">
								<HomeIcon className="size-4" />
							</ItemMedia>
							<span>Home</span>
						</Item>

						<Item
							className={cn("hover:bg-muted", inBlog && "bg-muted font-medium")}
							render={<Link href="/blog" />}
							size="sm"
						>
							<ItemMedia variant="icon">
								<BookOpenIcon className="size-4" />
							</ItemMedia>
							<span>Blog</span>
						</Item>

						{/* <Item
							className={cn(
								"hover:bg-muted",
								inForms && "bg-muted font-medium"
							)}
							render={<Link href="/forms" />}
							size="sm"
						>
							<ItemMedia variant="icon">
								<LayoutGrid
									className={cn(
										"size-4",
										inForms ? "text-foreground" : "text-muted-foreground"
									)}
								/>
							</ItemMedia>
							<span
								className={cn(
									"text-sm",
									inForms ? "text-foreground" : "text-muted-foreground"
								)}
							>
								Forms
							</span>
						</Item> */}

						{inForms &&
							FORMS_NAV.map((route) => {
								const active = isRouteActive(pathname, route.activePatterns);
								return (
									<Item
										className={cn(
											"ml-4 hover:bg-muted",
											active && "bg-muted font-medium"
										)}
										key={route.href}
										render={<Link href={route.href} />}
										size="sm"
									>
										<ItemMedia variant="icon">
											<route.icon
												className={cn(
													"size-4",
													active ? "text-foreground" : "text-muted-foreground"
												)}
											/>
										</ItemMedia>
										<span
											className={cn(
												"text-sm",
												active ? "text-foreground" : "text-muted-foreground"
											)}
										>
											{route.name}
										</span>
									</Item>
								);
							})}

						{/* <Item
							className={cn(
								"hover:bg-muted",
								inPrimitives && "bg-muted font-medium"
							)}
							render={<Link href="/primitives" />}
							size="sm"
						>
							<ItemMedia variant="icon">
								<BlocksIcon
									className={cn(
										"size-4",
										inPrimitives ? "text-foreground" : "text-muted-foreground"
									)}
								/>
							</ItemMedia>
							<span
								className={cn(
									"text-sm",
									inPrimitives ? "text-foreground" : "text-muted-foreground"
								)}
							>
								Primitives
							</span>
						</Item> */}

						{/* {inPrimitives &&
							PRIMITIVES_NAV.map((route) => {
								const active = isRouteActive(pathname, route.activePatterns);
								return (
									<Item
										className={cn(
											"ml-4 hover:bg-muted",
											active && "bg-muted font-medium"
										)}
										key={route.href}
										render={<Link href={route.href} />}
										size="sm"
									>
										<ItemMedia variant="icon">
											<route.icon
												className={cn(
													"size-4",
													active ? "text-foreground" : "text-muted-foreground"
												)}
											/>
										</ItemMedia>
										<span
											className={cn(
												"text-sm",
												active ? "text-foreground" : "text-muted-foreground"
											)}
										>
											{route.name}
										</span>
									</Item>
								);
							})} */}
					</ItemGroup>
				</nav>
			</WireframeSidebarContent>

			{/* <WireframeSidebarFooter className="p-3">
				<ThemeToggle />
			</WireframeSidebarFooter> */}
		</WireframeSidebar>
	);
}
