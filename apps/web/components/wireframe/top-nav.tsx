import { WireframeNav } from "@oss/ui/components/wireframe";

export function TopNav(props: React.ComponentProps<typeof WireframeNav>) {
	return (
		<WireframeNav {...props}>
			<div className="bg-(image:--crossed-gradient) flex h-full w-full items-center justify-between bg-fuchsia-500/40">
				<div className="flex h-full items-center gap-2 pl-4">
					<div className="border-2 border-foreground bg-background px-2 font-bold">
						Logo
					</div>
				</div>
				<nav className="flex h-full items-center gap-4 pr-4">
					<div className="border-2 border-foreground bg-background px-2 font-bold">
						Links
					</div>
				</nav>
			</div>
		</WireframeNav>
	);
}
