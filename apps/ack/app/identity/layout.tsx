import type { ReactNode } from "react";
import { IdentityFlowProvider } from "./_state/identity-flow.provider";

export default function IdentityLayout({ children }: { children: ReactNode }) {
	return <IdentityFlowProvider>{children}</IdentityFlowProvider>;
}
