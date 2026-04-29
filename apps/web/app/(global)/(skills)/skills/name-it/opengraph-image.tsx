import { OG_CONTENT_TYPE, OG_SIZE } from "@oss/seo";
import { ImageResponse } from "next/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
	const [serifRegular, serifBold] = await Promise.all([
		fetch(
			"https://cdn.jsdelivr.net/npm/@fontsource/eb-garamond/files/eb-garamond-latin-400-normal.woff"
		).then((r) => r.arrayBuffer()),
		fetch(
			"https://cdn.jsdelivr.net/npm/@fontsource/eb-garamond/files/eb-garamond-latin-700-normal.woff"
		).then((r) => r.arrayBuffer()),
	]);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				backgroundColor: "#ffffff",
				padding: "72px 80px",
				position: "relative",
				fontFamily: "EB Garamond",
			}}
		>
			{/* Top label */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: "32px",
					position: "relative",
				}}
			>
				<span
					style={{
						fontSize: "20px",
						color: "black",
						letterSpacing: "0.15em",
						textTransform: "uppercase",
					}}
				>
					Agent Skills
				</span>
				<span
					style={{
						fontSize: "20px",
						color: "black",
						letterSpacing: "0.08em",
					}}
				>
					ramoz.dev/skills
				</span>
			</div>

			{/* Divider */}
			<div
				style={{
					height: "2px",
					backgroundColor: "#3d2b1f",
					marginBottom: "32px",
					position: "relative",
				}}
			/>

			{/* Headword */}
			<div
				style={{
					display: "flex",
					alignItems: "baseline",
					gap: "20px",
					marginBottom: "8px",
					position: "relative",
				}}
			>
				<span
					style={{
						fontSize: "96px",
						fontWeight: 700,
						color: "black",
						lineHeight: 1,
					}}
				>
					name-it
				</span>
				<span
					style={{
						fontSize: "36px",
						color: "black",
						fontStyle: "italic",
						paddingBottom: "4px",
					}}
				>
					/`neim it/
				</span>
			</div>

			{/* Part of speech */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					marginBottom: "24px",
					position: "relative",
				}}
			>
				<span
					style={{
						fontSize: "24px",
						fontStyle: "italic",
						color: "black",
					}}
				>
					skill, agent
				</span>
				<span style={{ color: "black", fontSize: "24px" }}>·</span>
			</div>

			{/* Definition */}
			<div
				style={{
					display: "flex",
					gap: "16px",
					marginBottom: "20px",
					position: "relative",
				}}
			>
				<span
					style={{
						fontSize: "28px",
						color: "#3d2b1f",
						fontWeight: 700,
						minWidth: "24px",
					}}
				>
					1.
				</span>
				<span
					style={{
						fontSize: "28px",
						color: "black",
						lineHeight: 1.5,
						maxWidth: "900px",
					}}
				>
					An agent skill that generates novel, easy-to-pronounce names for
					products, brands, and tools through linguistic search across world
					languages.
				</span>
			</div>

			{/* Example */}
			<div
				style={{
					display: "flex",
					gap: "16px",
					position: "relative",
				}}
			>
				<span
					style={{
						fontSize: "24px",
						color: "black",
						minWidth: "24px",
					}}
				>
					—
				</span>
				<span
					style={{
						fontSize: "24px",
						fontStyle: "italic",
						color: "black",
						lineHeight: 1.5,
					}}
				>
					"Help me name my startup" · "Brand name for my tool"
				</span>
			</div>

			{/* Bottom rule */}
			<div
				style={{
					position: "absolute",
					bottom: "64px",
					left: "80px",
					right: "80px",
					height: "2px",
					backgroundColor: "#3d2b1f",
				}}
			/>

			{/* Etymology footer */}
			<div
				style={{
					position: "absolute",
					bottom: "36px",
					left: "80px",
					right: "80px",
					display: "flex",
					justifyContent: "space-between",
				}}
			/>
		</div>,
		{
			...OG_SIZE,
			fonts: [
				{
					name: "EB Garamond",
					data: serifRegular,
					weight: 400,
					style: "normal",
				},
				{ name: "EB Garamond", data: serifBold, weight: 700, style: "normal" },
			],
		}
	);
}
