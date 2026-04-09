"use client";

import { APP } from "@oss/shared/metadata";
import { Sidebar } from "@oss/ui/components/nav/sidebar";
import { PRIMITIVES_NAV } from "@/config/primitives";

export function PrimitivesSidebar() {
	return (
		<Sidebar
			github={APP.github.url}
			routes={PRIMITIVES_NAV}
			shortDesc="Primitives"
			title="Forms"
		/>
	);
}
