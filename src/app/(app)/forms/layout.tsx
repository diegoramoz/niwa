import { FormsSidebar } from "@/components/nav/forms-sidebar";
import { Wireframe } from "@/components/ui/wireframe";

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wireframe
      config={{
        corners: {
          topLeft: "navbar",
          bottomLeft: "navbar",
        },
      }}
    >
      <FormsSidebar />
      <div className="px-4 pt-4">{children}</div>
    </Wireframe>
  );
}
