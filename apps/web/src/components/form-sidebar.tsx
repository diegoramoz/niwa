"use client";

import { APP } from "@oss/shared/metadata";
import { Sidebar } from "@oss/ui/components/nav/sidebar";
import { FORMS_NAV } from "@/config/forms";

export function FormsSidebar() {
	return (
		<Sidebar
			github={APP.github.url}
			routes={FORMS_NAV}
			shortDesc="Forms"
			title="Forms"
		/>
	);
}
