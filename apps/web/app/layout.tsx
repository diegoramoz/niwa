import { Geist, Geist_Mono } from "next/font/google";
import "@/index.css";
import { cn } from "@oss/ui/lib/utils";
import { generateMetadata } from "lib/seo";
import type { Metadata } from "next";
import Providers from "providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

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
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
