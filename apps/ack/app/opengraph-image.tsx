import { OG_CONTENT_TYPE, OG_SIZE } from "@oss/seo";
import { generateOgImage } from "lib/seo";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
	return generateOgImage({
		title: "Diego Ramos",
		description: "Full-Stack Engineer.",
	});
}
