"use client";

import { Button } from "@oss/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@oss/ui/components/dialog";
import {
	defaultCSSVariables,
	useWireframeConfig,
} from "@oss/ui/components/wireframe/wireframe-config-provider";
import { Check, Code2, Copy } from "lucide-react";
import { useState } from "react";

export function WireframeCodeModal() {
	const { config } = useWireframeConfig();
	const [copied, setCopied] = useState(false);
	const [open, setOpen] = useState(false);

	const buildCornersCode = () => {
		const corners = [
			{ key: "topLeft", value: config.corners.topLeft },
			{ key: "topRight", value: config.corners.topRight },
			{ key: "bottomLeft", value: config.corners.bottomLeft },
			{ key: "bottomRight", value: config.corners.bottomRight },
		];

		const cornerEntries = corners
			.filter((corner) => corner.value !== "sidebar")
			.map((corner) => `      ${corner.key}: "${corner.value}"`);

		const responsiveCorners = [
			{ key: "left", value: config.corners.responsive.left },
			{ key: "right", value: config.corners.responsive.right },
		];

		const responsiveEntries = responsiveCorners
			.filter((corner) => corner.value !== "sidebar")
			.map((corner) => `        ${corner.key}: "${corner.value}"`);

		if (responsiveEntries.length > 0) {
			cornerEntries.push(
				`      responsive: {\n${responsiveEntries.join(",\n")}\n      }`
			);
		}

		return cornerEntries.length > 0
			? `    corners: {\n${cornerEntries.join(",\n")}\n    },\n`
			: "";
	};

	const generateCode = () => {
		// Filter out CSS variables that match default values
		const nonDefaultCssVars = Object.entries(config.cssVariables).filter(
			([key, value]) =>
				(defaultCSSVariables as Record<string, number | undefined>)[key] !==
				value
		);

		const cssVarsCode =
			nonDefaultCssVars.length > 0
				? `    cssVariables: {\n${nonDefaultCssVars
						.map(([key, value]) => `      "${key}": ${value}`)
						.join(",\n")}\n    },\n`
				: "";

		const cornersCode = buildCornersCode();
		const hasConfig = cssVarsCode || cornersCode;
		const configAttr = hasConfig
			? `\n  config={{\n${cssVarsCode}${cornersCode}  }}`
			: "";

		// Nav segment
		let navSegment: string;
		if (config.navType === "normal") {
			const navParts: string[] = [];
			if (config.showTopNav) {
				navParts.push(
					`<WireframeNav position="top">\n    {/* children */}\n  </WireframeNav>`
				);
			}
			if (config.showBottomNav) {
				navParts.push(
					`<WireframeNav position="bottom">\n    {/* children */}\n  </WireframeNav>`
				);
			}
			navSegment = navParts.join("\n  ");
		} else if (config.navType === "responsive") {
			navSegment = `<WireframeNav position="responsive">\n    {/* children */}\n  </WireframeNav>`;
		} else {
			navSegment =
				"<WireframeStickyNav>\n     {/* children */}\n  </WireframeStickyNav>";
		}

		const innerParts: string[] = [navSegment];

		if (config.showLeftSidebar) {
			innerParts.push(
				`<WireframeSidebar\n    collapsed={leftSidebarCollapsed}\n    position="left"\n  >\n    {/* children */}\n  </WireframeSidebar>`
			);
		}
		if (config.showRightSidebar) {
			innerParts.push(
				`<WireframeSidebar\n    collapsed={rightSidebarCollapsed}\n    position="right"\n  >\n    {/* children */}\n  </WireframeSidebar>`
			);
		}
		innerParts.push("{/* children */}");

		return `<Wireframe${configAttr}>\n  ${innerParts.join("\n\n  ")}\n</Wireframe>`;
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(generateCode());
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger className="inline-flex size-12 items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
				<Code2 className="size-5" />
				<span className="sr-only">View Code</span>
			</DialogTrigger>
			<DialogContent className="flex max-h-[90dvh] max-w-3xl flex-col sm:max-h-[85vh]">
				<DialogHeader className="shrink-0">
					<DialogTitle>Wireframe Configuration</DialogTitle>
					<DialogDescription>
						Copy this code to use your current wireframe configuration
					</DialogDescription>
				</DialogHeader>
				<div className="relative min-h-0 flex-1 overflow-auto">
					<pre className="rounded-lg bg-muted p-4 font-mono text-sm">
						<code>{generateCode()}</code>
					</pre>
					<Button
						className="absolute top-2 right-2"
						onClick={handleCopy}
						size="sm"
						variant="secondary"
					>
						{copied ? (
							<>
								<Check className="mr-2 size-4" />
								Copied!
							</>
						) : (
							<>
								<Copy className="mr-2 size-4" />
								Copy
							</>
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
