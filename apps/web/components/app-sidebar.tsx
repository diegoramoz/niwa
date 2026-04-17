"use client";

import { SiGithub, SiX, SiYoutube } from "@icons-pack/react-simple-icons";
import { Item, ItemGroup, ItemMedia } from "@oss/ui/components/item";
import {
	WireframeSidebar,
	WireframeSidebarContent,
	WireframeSidebarFooter,
	WireframeSidebarHeader,
} from "@oss/ui/components/wireframe";
import { isRouteActive } from "@oss/ui/hooks/use-nav-routes";
import { cn } from "@oss/ui/lib/utils";
import { FORMS_NAV } from "config/forms";
import { PRIMITIVES_NAV } from "config/primitives";
import {
	BlocksIcon,
	BookOpenIcon,
	LayoutGrid,
	MoonIcon,
	SunIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	return (
		<button
			className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			type="button"
		>
			{resolvedTheme === "dark" ? (
				<SunIcon className="size-4 shrink-0" />
			) : (
				<MoonIcon className="size-4 shrink-0" />
			)}
			<span>{resolvedTheme === "dark" ? "Light mode" : "Dark mode"}</span>
		</button>
	);
}

export function AppSidebar() {
	const pathname = usePathname();

	const inBlog = isRouteActive(pathname, ["/blog", "/blog/*"]);
	const inForms = isRouteActive(pathname, ["/forms", "/forms/*"]);
	const inPrimitives = isRouteActive(pathname, [
		"/primitives",
		"/primitives/*",
	]);

	return (
		<WireframeSidebar
			className="border-r bg-background"
			hide="mobile"
			position="left"
		>
			<WireframeSidebarHeader className="p-3">
				<div className="px-3 py-2">
					<Link
						className="font-semibold text-sm transition-colors hover:text-muted-foreground"
						href="/"
					>
						<div className="flex items-center justify-between">
							<div>
								<h1 className="font-bold">Diego Ramos</h1>
								<div className="font-medium text-muted-foreground text-xs">
									Full-Stack Engineer
								</div>
							</div>
							<Image
								alt="Logo"
								className="size-7"
								height={512}
								src="/logo.png"
								width={512}
							/>
						</div>
					</Link>
				</div>
			</WireframeSidebarHeader>

			<WireframeSidebarContent className="p-3">
				<nav className="flex flex-col gap-1">
					<ItemGroup>
						<Item
							className={cn("hover:bg-muted", inBlog && "bg-muted font-medium")}
							render={<Link href="/blog" />}
							size="sm"
						>
							<ItemMedia variant="icon">
								<BookOpenIcon
									className={cn(
										"size-4",
										inBlog ? "text-foreground" : "text-muted-foreground"
									)}
								/>
							</ItemMedia>
							<span
								className={cn(
									"text-sm",
									inBlog ? "text-foreground" : "text-muted-foreground"
								)}
							>
								Blog
							</span>
						</Item>

						<Item
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
						</Item>

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

						<Item
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
						</Item>

						{inPrimitives &&
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
							})}
					</ItemGroup>
				</nav>
			</WireframeSidebarContent>

			<WireframeSidebarFooter className="p-3">
				<a
					className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href="https://github.com/diegoramoz"
					rel="noopener noreferrer"
					target="_blank"
				>
					<SiGithub className="size-4 shrink-0" />
					<span>GitHub</span>
				</a>
				<a
					className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href="https://youtube.com/@diegoramozdev"
					rel="noopener noreferrer"
					target="_blank"
				>
					<SiYoutube className="size-4 shrink-0" />
					<span>YouTube</span>
				</a>
				<a
					className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href="https://x.com/zdiegoramos"
					rel="noopener noreferrer"
					target="_blank"
				>
					<SiX className="size-4 shrink-0" />
					<span>X</span>
				</a>
				<a
					className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href={"https://linkedin.com/in/ramoz"}
					rel="noopener noreferrer"
					target="_blank"
				>
					<span>LinkedIn</span>
				</a>
				<a
					className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href="mailto:diego@ramoz.dev"
				>
					<span>Email</span>
				</a>
				<ThemeToggle />
			</WireframeSidebarFooter>
		</WireframeSidebar>
	);
}
