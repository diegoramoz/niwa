import type { Metadata } from "next";

// const BASE_URL = "https://ramoz.dev";

export const metadata: Metadata = {
	// openGraph: {
	// 	videos: [
	// 		{
	// 			url: `${BASE_URL}/og/dither.mp4`,
	// 			width: 1200,
	// 			height: 630,
	// 			type: "video/mp4",
	// 		},
	// 	],
	// },
	// twitter: {
	// 	card: "player",
	// 	players: [
	// 		{
	// 			playerUrl: `${BASE_URL}/og/dither.mp4`,
	// 			streamUrl: `${BASE_URL}/og/dither.mp4`,
	// 			width: 1200,
	// 			height: 630,
	// 		},
	// 	],
	// },
};

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="mx-auto max-w-2xl px-[4lvw] py-6 md:px-0">{children}</div>
	);
}
