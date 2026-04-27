import { Compass } from "lucide-react";
import Link from "next/link";

export function RoutesButton() {
	return (
		<Link
			aria-label="Open routes navigation"
			className="fixed right-[calc(env(safe-area-inset-right)+1rem)] bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-1000 inline-flex size-12 items-center justify-center rounded-full border-2 border-foreground bg-background shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0"
			href="/wireframe"
		>
			<Compass aria-hidden="true" className="size-5" />
		</Link>
	);
}
