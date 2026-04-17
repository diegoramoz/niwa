import { Geist, Geist_Mono } from "next/font/google";
import "@/index.css";
import { Wireframe } from "@oss/ui/components/wireframe";
import { cn } from "@oss/ui/lib/utils";
import { AppSidebar } from "components/app-sidebar";
import { AppTopNav } from "components/app-top-nav";
import { generateMetadata } from "lib/seo";
import type { Metadata } from "next";
import Providers from "providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

export const metadata: Metadata = generateMetadata({
	title: "OSS",
	description: "Open source software, built in public.",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			className={cn(
				"overscroll-none antialiased [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				fontMono.variable,
				"font-sans",
				geist.variable
			)}
			lang="en"
			suppressHydrationWarning
		>
			<body className="overscroll-none">
				<Providers>
					<Wireframe
						config={{
							corners: { topLeft: "navbar", topRight: "navbar" },
						}}
					>
						<AppTopNav />
						<AppSidebar />
						{children}
					</Wireframe>
				</Providers>
			</body>
		</html>
	);
}
