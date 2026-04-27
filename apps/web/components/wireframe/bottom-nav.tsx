import { WireframeNav } from "@oss/ui/components/wireframe";

export function BottomNav(
	props: Omit<React.ComponentProps<typeof WireframeNav>, "position">
) {
	return (
		<WireframeNav position="bottom" {...props}>
			<div className="bg-(image:--crossed-gradient) flex h-full w-full items-center justify-between bg-blue-600/40">
				<div className="flex h-full w-full items-center justify-center">
					<div className="border-2 border-foreground bg-background px-2 font-bold">
						bottom nav
					</div>
				</div>
			</div>
		</WireframeNav>
	);
}
