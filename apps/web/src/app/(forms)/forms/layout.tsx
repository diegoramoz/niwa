import { FormsSidebar } from "@oss/ui/components/nav/forms-sidebar";
import { Wireframe } from "@oss/ui/components/wireframe";

export default function FormsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Wireframe>
			<FormsSidebar />
			{children}
		</Wireframe>
	);
}
