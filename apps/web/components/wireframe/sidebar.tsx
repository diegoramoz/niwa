"use client";

import {
	WireframeSidebar,
	WireframeSidebarContent,
	WireframeSidebarFooter,
	WireframeSidebarHeader,
	type WireframeSidebarPosition,
} from "@oss/ui/components/wireframe";
import { PanelLeft, PanelLeftClose, PanelRight } from "lucide-react";
import { useState } from "react";

const controlClasses =
	"inline-flex size-11 items-center justify-center rounded-full border-2 border-foreground bg-background shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export function Sidebar() {
	const [collapsed, setCollapsed] = useState(false);
	const [position, setPosition] = useState<WireframeSidebarPosition>("left");

	const CollapseIcon = collapsed ? PanelLeft : PanelLeftClose;
	const PositionIcon = position === "left" ? PanelLeft : PanelRight;

	function handleClick() {
		setCollapsed(!collapsed);
	}

	function handlePositionToggle() {
		setPosition(position === "left" ? "right" : "left");
	}

	return (
		<WireframeSidebar collapsed={collapsed} position={position}>
			<WireframeSidebarHeader>
				<div className="bg-(image:--crossed-gradient) flex w-full items-center justify-center bg-pink-500/40 p-4">
					<div className="border-2 border-foreground bg-background px-2 font-bold">
						HEADER
					</div>
				</div>
			</WireframeSidebarHeader>
			<WireframeSidebarContent>
				<div className="bg-(image:--crossed-gradient) flex min-h-full w-full flex-col items-center justify-center gap-4 bg-pink-500/40 p-4">
					<button
						aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						className={controlClasses}
						onClick={handleClick}
						title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						type="button"
					>
						<CollapseIcon
							aria-hidden="true"
							className={position === "right" ? "size-5 rotate-180" : "size-5"}
						/>
					</button>
					<div className="border-2 border-foreground bg-background px-2 font-bold">
						SIDEBAR
					</div>
					<button
						aria-label={`Move sidebar to the ${position === "left" ? "right" : "left"}`}
						className={controlClasses}
						onClick={handlePositionToggle}
						title={`Sidebar on the ${position}; click to move it to the ${position === "left" ? "right" : "left"}`}
						type="button"
					>
						<PositionIcon aria-hidden="true" className="size-5" />
					</button>
				</div>
			</WireframeSidebarContent>
			<WireframeSidebarFooter>
				<div className="bg-(image:--crossed-gradient) flex w-full items-center justify-center bg-pink-500/40 p-4">
					<div className="border-2 border-foreground bg-background px-2 font-bold">
						FOOTER
					</div>
				</div>
			</WireframeSidebarFooter>
		</WireframeSidebar>
	);
}
