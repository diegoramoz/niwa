import { WireframeNav } from "@oss/ui/components/wireframe";
import { LogoSphere } from "./logo-sphere";

export function AppMobileTopNav() {
	return (
		<WireframeNav
			className="flex items-center justify-between border-b bg-background px-4"
			hideOn="desktop"
			position="top"
		>
			<div className="flex items-center">
				<LogoSphere />
				<div>
					<div className="font-bold text-sm">Diego Ramos</div>
					<div className="font-medium text-muted-foreground text-xs">
						Full-Stack Engineer
					</div>
				</div>
			</div>
		</WireframeNav>
	);
}
