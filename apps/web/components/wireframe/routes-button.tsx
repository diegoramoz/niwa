import Link from "next/link";

export function RoutesButton() {
	return (
		<div className="fixed right-[calc(env(safe-area-inset-right)+1rem)] bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-1000 inline-flex items-center gap-2">
			<Link
				aria-label="Open playground"
				className="inline-flex h-12 items-center justify-center rounded-full border-2 border-foreground bg-background px-4 font-medium text-sm lowercase shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0"
				href="/wireframe/playground"
			>
				playground
			</Link>
			<Link
				aria-label="Open layouts"
				className="inline-flex h-12 items-center justify-center rounded-full border-2 border-foreground bg-background px-4 font-medium text-sm lowercase shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0"
				href="/wireframe"
			>
				layouts
			</Link>
			<Link
				aria-label="View on GitHub"
				className="inline-flex h-12 items-center justify-center rounded-full border-2 border-foreground bg-background px-4 font-medium text-sm lowercase shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0"
				href="https://github.com/diegoramoz/wireframe"
				rel="noopener noreferrer"
				target="_blank"
			>
				github
			</Link>
		</div>
	);
}
