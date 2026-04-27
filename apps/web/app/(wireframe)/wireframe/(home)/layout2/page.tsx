import { WireframeStickyNav } from "@oss/ui/components/wireframe";
import { nanoid } from "nanoid";
import { BottomNav } from "@/components/wireframe/bottom-nav";
import { SidebarStatic } from "@/components/wireframe/sidebar-static";

export default function Page() {
	return (
		<div className="bg-(image:--crossed-gradient) min-h-screen">
			<WireframeStickyNav className="bg-red-300">
				<div className="flex h-full items-center justify-center">
					<div className="border-2 border-foreground bg-background px-2 font-bold">
						Nested Scrollable Areas Demo
					</div>
				</div>
			</WireframeStickyNav>
			<SidebarStatic />
			<BottomNav />

			{/* Main Content - Scrollable Container */}
			<div className="mx-auto max-w-6xl p-4">
				<h1 className="mb-6 font-bold text-3xl">
					<div className="border-2 border-foreground bg-background px-2 font-bold">
						Nested Scrollable Areas Example
					</div>
				</h1>

				{/* Outer Scrollable Area */}
				<div className="h-150 overflow-y-auto rounded-lg border-4 border-blue-500 bg-blue-50 p-6">
					<h2 className="mb-4 font-bold text-2xl text-blue-900">
						Outer Scroll Container (600px height)
					</h2>
					<p className="mb-4 text-blue-800">
						This is the main scrollable container. Scroll down to see nested
						scrollable areas and more content below.
					</p>

					{/* First Nested Scrollable Area */}
					<div className="mb-6 h-75 overflow-y-auto rounded-lg border-4 border-green-500 bg-green-50 p-4">
						<h3 className="mb-3 font-bold text-green-900 text-xl">
							Nested Scroll Area 1 (300px height)
						</h3>
						<p className="mb-2 text-green-800">
							This area scrolls independently from the outer container. Try
							scrolling here!
						</p>
						{Array.from({ length: 30 }, (_, i) => (
							<p className="mb-2 text-green-700" key={nanoid()}>
								Line {i + 1}: This is content inside the first nested scrollable
								area. Each scroll area maintains its own scroll position.
							</p>
						))}
					</div>

					{/* Content between nested areas */}
					<div className="my-6 rounded-lg bg-blue-100 p-4">
						<h3 className="mb-2 font-semibold text-blue-900 text-lg">
							Content Between Nested Areas
						</h3>
						<p className="text-blue-800">
							This content is part of the outer scroll container. Keep scrolling
							in the outer container to see the second nested scrollable area
							below.
						</p>
					</div>

					{/* Second Nested Scrollable Area */}
					<div className="mb-6 h-62.5 overflow-y-auto rounded-lg border-4 border-purple-500 bg-purple-50 p-4">
						<h3 className="mb-3 font-bold text-purple-900 text-xl">
							Nested Scroll Area 2 (250px height)
						</h3>
						<p className="mb-2 text-purple-800">
							Another independently scrollable area with different styling.
						</p>

						{/* Deeply Nested Scrollable Area */}
						<div className="my-4 h-37.5 overflow-y-auto rounded-lg border-4 border-orange-500 bg-orange-50 p-3">
							<h4 className="mb-2 font-bold text-orange-900">
								Deeply Nested Scroll Area (150px height)
							</h4>
							<p className="mb-2 text-orange-800 text-sm">
								This is a third level of nesting! It scrolls independently from
								both parent containers.
							</p>
							{Array.from({ length: 20 }, (_, i) => (
								<p className="mb-1 text-orange-700 text-sm" key={nanoid()}>
									Nested line {i + 1}: You can scroll here while the parent
									containers remain stationary.
								</p>
							))}
						</div>

						{Array.from({ length: 15 }, (_, i) => (
							<p className="mb-2 text-purple-700" key={nanoid()}>
								Line {i + 1}: More content in the second nested area. Notice how
								this scrolls separately from the deeply nested area above.
							</p>
						))}
					</div>

					{/* Additional content in outer container */}
					<div className="my-6 rounded-lg bg-blue-100 p-4">
						<h3 className="mb-2 font-semibold text-blue-900 text-lg">
							More Outer Content
						</h3>
						<p className="text-blue-800">
							Continue scrolling to see even more content in the outer
							container.
						</p>
					</div>

					{/* Third Nested Scrollable Area - Horizontal */}
					<div className="mb-6 overflow-x-auto rounded-lg border-4 border-red-500 bg-red-50 p-4">
						<h3 className="mb-3 font-bold text-red-900 text-xl">
							Horizontal Scroll Area
						</h3>
						<p className="mb-2 text-red-800">
							This area demonstrates horizontal scrolling instead of vertical.
						</p>
						<div className="flex gap-4">
							{Array.from({ length: 20 }, (_, i) => (
								<div
									className="flex h-32 w-48 shrink-0 items-center justify-center rounded-lg bg-red-200 font-bold text-red-900"
									key={nanoid()}
								>
									Card {i + 1}
								</div>
							))}
						</div>
					</div>

					{/* Bottom content */}
					{Array.from({ length: 10 }, (_, i) => (
						<p className="mb-2 text-blue-700" key={nanoid()}>
							Outer container line {i + 1}: This is additional content in the
							outer scrollable container. Each nested area maintains its own
							scroll position independently.
						</p>
					))}

					<div className="mt-6 rounded-lg bg-blue-200 p-4">
						<h3 className="mb-2 font-bold text-blue-900">Summary</h3>
						<ul className="list-inside list-disc space-y-1 text-blue-800">
							<li>Blue border: Outer scrollable container</li>
							<li>Green border: First nested vertical scroll area</li>
							<li>Purple border: Second nested vertical scroll area</li>
							<li>Orange border: Deeply nested scroll area (3 levels deep)</li>
							<li>Red border: Horizontal scroll area</li>
						</ul>
					</div>
				</div>

				<p className="mt-4 text-center text-gray-600">
					All scroll areas work independently - try scrolling in different areas
					to see how they maintain separate scroll positions.
				</p>
			</div>
		</div>
	);
}
