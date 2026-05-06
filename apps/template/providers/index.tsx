"use client";

import { Toaster } from "@oss/ui/components/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<Toaster richColors />
		</>
	);
}
