"use client";

import { WEB_METADATA } from "@oss/shared/metadata/web";
import { Sidebar } from "@oss/ui/components/nav/sidebar";
import { FORMS_NAV } from "@/config/forms";

export function FormsSidebar() {
	return (
		<Sidebar
			github={WEB_METADATA.github.url}
			routes={FORMS_NAV}
			shortDesc="Forms"
			title="Forms"
		/>
	);
}
