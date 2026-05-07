import { Geist, Geist_Mono } from "next/font/google";
import "@/index.css";
import { Wireframe } from "@oss/ui/components/wireframe";
import { cn } from "@oss/ui/lib/utils";
import { generateMetadata } from "lib/seo";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { AppBottomNav } from "@/components/app-bottom-nav";
import { AppTopNav } from "@/components/app-top-nav";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	viewportFit: "cover",
	userScalable: false,
};

export const metadata: Metadata = generateMetadata({
	title: "Diego Ramos",
	description: "Full-Stack Engineer.",
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
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					disableTransitionOnChange
					enableSystem
				>
					<Wireframe>
						<AppTopNav />
						<AppBottomNav />
						{children}
					</Wireframe>
				</ThemeProvider>
			</body>
		</html>
	);
}
