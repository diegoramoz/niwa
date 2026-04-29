import { generateMetadata } from "lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateMetadata({
	title: "name-it — Skills",
	description:
		"Generate novel, easy-to-pronounce names for products, companies, brands, tools, or projects through a conversational linguistic search.",
	path: "/skills/name-it",
});

export default function NameItLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
