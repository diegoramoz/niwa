export type RoutePreviewKind =
	| "responsive-sidebar"
	| "sidebar-bottom"
	| "sticky-sidebar-bottom"
	| "top-bottom"
	| "header-sticky-sidebar"
	| "sticky-layers";

export type RouteCatalogItem = {
	href: string;
	title: string;
	description: string;
	preview: RoutePreviewKind;
};

export const routeCatalog = [
	{
		href: "/layout1",
		title: "Layout 1",
		description:
			"Bottom navigation paired with a collapsible sidebar. Useful when primary actions stay docked at the bottom while secondary controls live in a side rail.",
		preview: "sidebar-bottom",
	},
	{
		href: "/layout2",
		title: "Layout 2",
		description:
			"Sticky top bar with static sidebar and bottom nav around nested scroll regions. Useful for dashboards with persistent context plus deep in-page scrolling.",
		preview: "sticky-sidebar-bottom",
	},
	{
		href: "/layout3",
		title: "Layout 3",
		description:
			"Top and bottom navigation at the same time. Useful for experiences where global navigation and quick mobile actions must both stay visible.",
		preview: "top-bottom",
	},
	{
		href: "/layout4",
		title: "Layout 4",
		description:
			"Responsive nav that shifts position by viewport with a collapsible sidebar. Useful for product flows that need one navigation model across device sizes.",
		preview: "responsive-sidebar",
	},
	{
		href: "/layout5",
		title: "Layout 5",
		description:
			"Header plus sticky nav and sidebar. Useful for content-heavy pages that keep section controls pinned while users scan long documents.",
		preview: "header-sticky-sidebar",
	},
	{
		href: "/blog",
		title: "Blog",
		description:
			"Responsive nav and sidebar in the blog route group. Useful as a baseline content template with flexible navigation behavior.",
		preview: "responsive-sidebar",
	},
] as const satisfies readonly RouteCatalogItem[];
