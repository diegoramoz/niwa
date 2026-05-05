import "@/index.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
	title: "ACK Identity Demo",
	description:
		"Interactive browser walkthrough of the Agent Commerce Kit identity flow",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={`${geist.variable} ${geistMono.variable} antialiased`}
			lang="en"
			suppressHydrationWarning
		>
			<body>{children}</body>
		</html>
	);
}
