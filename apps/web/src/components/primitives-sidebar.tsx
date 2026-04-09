"use client";

import { WEB_METADATA } from "@oss/shared/metadata/web";
import { Sidebar } from "@oss/ui/components/nav/sidebar";
import { PRIMITIVES_NAV } from "@/config/primitives";

export function PrimitivesSidebar() {
	return (
		<Sidebar
			github={WEB_METADATA.github.url}
			routes={PRIMITIVES_NAV}
			shortDesc="Primitives"
			title="Forms"
		/>
	);
}
