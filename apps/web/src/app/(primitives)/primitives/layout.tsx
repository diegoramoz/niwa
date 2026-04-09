import { PrimitivesSidebar } from "@oss/ui/components/nav/primitives-sidebar";
import { Wireframe } from "@oss/ui/components/wireframe";

export default function PrimitivesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Wireframe
			config={{
				cssVariables: {
					"--left-sidebar-width-expanded": 60,
				},
			}}
		>
			<PrimitivesSidebar />
			{children}
		</Wireframe>
	);
}
