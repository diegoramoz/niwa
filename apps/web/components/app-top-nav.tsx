import { WireframeNav } from "@oss/ui/components/wireframe";
import { LogoSphere } from "./logo-sphere";

export function AppTopNav() {
	return (
		<WireframeNav
			className="flex items-center justify-between border-b bg-background px-4"
			hide="mobile"
			position="top"
		>
			<div className="flex items-center gap-3">
				<LogoSphere />
				<div>
					<div className="font-bold text-sm">Diego Ramos</div>
					<div className="font-medium text-muted-foreground text-xs">
						Full-Stack Engineer
					</div>
				</div>
			</div>

			<div className="flex items-center gap-1">
				<a
					className="rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href="https://linkedin.com/in/ramoz"
					rel="noopener noreferrer"
					target="_blank"
				>
					LinkedIn
				</a>
				<a
					className="rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href="https://youtube.com/@diegoramozdev"
					rel="noopener noreferrer"
					target="_blank"
				>
					YouTube
				</a>
				<a
					className="rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href="https://x.com/zdiegoramos"
					rel="noopener noreferrer"
					target="_blank"
				>
					X
				</a>
				<a
					className="rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href="mailto:diego@ramoz.dev"
				>
					Email
				</a>
				<a
					className="rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
					href="https://github.com/diegoramoz"
					rel="noopener noreferrer"
					target="_blank"
				>
					GitHub
				</a>
			</div>
		</WireframeNav>
	);
}
