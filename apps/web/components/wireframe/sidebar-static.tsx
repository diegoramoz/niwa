import {
	WireframeSidebar,
	WireframeSidebarContent,
	WireframeSidebarFooter,
	WireframeSidebarHeader,
} from "@oss/ui/components/wireframe";

export function SidebarStatic() {
	return (
		<WireframeSidebar collapsed={false} position="left">
			<WireframeSidebarHeader>
				<div className="bg-(image:--crossed-gradient) flex w-full items-center justify-center bg-lime-500/40 p-4">
					<div className="flex h-full items-center justify-center">
						<div className="border-2 border-foreground bg-background px-2 font-bold">
							Header
						</div>
					</div>
				</div>
			</WireframeSidebarHeader>
			<WireframeSidebarContent>
				<div className="bg-(image:--crossed-gradient) flex min-h-full w-full items-center justify-center bg-lime-500/40 p-4">
					<div className="flex h-full items-center justify-center">
						<div className="border-2 border-foreground bg-background px-2 font-bold">
							Sidebar
						</div>
					</div>
				</div>
			</WireframeSidebarContent>
			<WireframeSidebarFooter>
				<div className="bg-(image:--crossed-gradient) flex w-full items-center justify-center bg-lime-500/40 p-4">
					<div className="flex h-full items-center justify-center">
						<div className="border-2 border-foreground bg-background px-2 font-bold">
							Footer
						</div>
					</div>
				</div>
			</WireframeSidebarFooter>
		</WireframeSidebar>
	);
}
