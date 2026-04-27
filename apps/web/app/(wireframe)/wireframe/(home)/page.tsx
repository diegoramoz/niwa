import Link from "next/link";
import { type RoutePreviewKind, routeCatalog } from "@/lib/route-catalog";

function RoutePreview({ preview }: { preview: RoutePreviewKind }) {
	if (preview === "top-bottom") {
		return (
			<div className="relative h-32 overflow-hidden rounded-md border-2 border-foreground bg-zinc-100">
				<div className="absolute inset-x-0 top-0 h-6 border-foreground border-b-2 bg-fuchsia-500/40" />
				<div className="absolute inset-x-0 bottom-0 h-6 border-foreground border-t-2 bg-blue-600/40" />
				<div className="absolute inset-x-4 top-8 bottom-8 rounded-sm border border-foreground/40 border-dashed bg-background/70" />
			</div>
		);
	}

	if (preview === "sidebar-bottom") {
		return (
			<div className="relative h-32 overflow-hidden rounded-md border-2 border-foreground bg-zinc-100">
				<div className="absolute inset-y-0 left-0 z-10 w-9 border-foreground border-r-2 bg-background" />
				<div className="absolute inset-y-0 left-0 z-10 w-9 border-foreground border-r-2 bg-pink-500/40" />
				<div className="absolute inset-x-0 bottom-0 h-6 border-foreground border-t-2 bg-blue-600/40" />
				<div className="absolute top-3 right-3 bottom-8 left-11 rounded-sm border border-foreground/40 border-dashed bg-background/70" />
			</div>
		);
	}

	if (preview === "sticky-sidebar-bottom") {
		return (
			<div className="relative h-32 overflow-hidden rounded-md border-2 border-foreground bg-zinc-100">
				<div className="absolute inset-x-0 top-0 h-6 border-foreground border-b-2 bg-red-300" />
				<div className="absolute inset-y-0 left-0 z-10 w-9 border-foreground border-r-2 bg-background" />
				<div className="absolute inset-y-0 left-0 z-10 w-9 border-foreground border-r-2 bg-lime-500/40" />
				<div className="absolute inset-x-0 bottom-0 h-6 border-foreground border-t-2 bg-blue-600/40" />
				<div className="absolute top-8 right-3 bottom-8 left-11 rounded-sm border border-foreground/40 border-dashed bg-background/70" />
			</div>
		);
	}

	if (preview === "header-sticky-sidebar") {
		return (
			<div className="relative h-32 overflow-hidden rounded-md border-2 border-foreground bg-zinc-100">
				<div className="absolute inset-x-0 top-0 h-5 border-foreground border-b-2 bg-green-600/40" />
				<div className="absolute inset-x-0 top-5 h-5 border-foreground border-b-2 bg-fuchsia-500/40" />
				<div className="absolute inset-y-0 top-10 left-0 w-9 border-foreground border-r-2 bg-pink-500/40" />
				<div className="absolute top-12 right-3 bottom-3 left-11 rounded-sm border border-foreground/40 border-dashed bg-background/70" />
			</div>
		);
	}

	if (preview === "sticky-layers") {
		return (
			<div className="relative h-32 overflow-hidden rounded-md border-2 border-foreground bg-zinc-100">
				<div className="absolute inset-x-0 top-0 h-6 border-foreground border-b-2 bg-red-300" />
				<div className="absolute inset-x-2 top-7 h-5 rounded-sm border border-foreground bg-blue-500/70" />
				<div className="absolute inset-x-4 top-13 h-5 rounded-sm border border-foreground bg-green-500/70" />
				<div className="absolute inset-y-0 left-0 z-10 w-9 border-foreground border-r-2 bg-background" />
				<div className="absolute inset-y-0 left-0 z-10 w-9 border-foreground border-r-2 bg-lime-500/40" />
				<div className="absolute inset-x-0 bottom-0 h-6 border-foreground border-t-2 bg-blue-600/40" />
			</div>
		);
	}

	return (
		<div className="relative h-32 overflow-hidden rounded-md border-2 border-foreground bg-zinc-100">
			<div className="absolute inset-x-0 top-0 h-6 border-foreground border-b-2 bg-fuchsia-500/40" />
			<div className="absolute inset-y-0 top-6 left-0 w-9 border-foreground border-r-2 bg-pink-500/40" />
			<div className="absolute top-8 right-3 bottom-3 left-11 rounded-sm border border-foreground/40 border-dashed bg-background/70" />
		</div>
	);
}

export default function NavigationPage() {
	return (
		<main className="bg-(image:--crossed-gradient) min-h-screen p-4 sm:p-8">
			<div className="mx-auto max-w-6xl">
				<header className="mb-6 rounded-lg border-2 border-foreground bg-background p-4 shadow-[6px_6px_0_0_#000] sm:mb-8">
					<h1 className="font-black text-2xl sm:text-3xl">Wireframe</h1>
					<p className="mt-2 text-sm sm:text-base">
						Explore different navigation and layout configurations using
						wireframe.
					</p>
				</header>

				<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{routeCatalog.map((item) => (
						<Link href={`/wireframe${item.href}`} key={item.href}>
							<article className="flex h-full flex-col gap-3 rounded-lg border-2 border-foreground bg-background p-3 shadow-[4px_4px_0_0_#000]">
								<RoutePreview preview={item.preview} />
								<div>
									<h2 className="font-extrabold text-lg">{item.title}</h2>
									<p className="font-mono text-muted-foreground text-xs">
										{item.href}
									</p>
								</div>
								<p className="text-muted-foreground text-sm">
									{item.description}
								</p>
							</article>
						</Link>
					))}
				</section>
			</div>
		</main>
	);
}
