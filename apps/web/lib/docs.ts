import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type DocMetadata = {
	title: string;
	description?: string;
	order?: number;
};

export type Doc = {
	slug: string;
	metadata: DocMetadata;
};

const contentDir = path.join(process.cwd(), "content/docs");

function normalizeDocMetadata(
	slug: string,
	data: Record<string, unknown>
): DocMetadata {
	return {
		title: typeof data.title === "string" ? data.title : slug,
		description:
			typeof data.description === "string" ? data.description : undefined,
		order: typeof data.order === "number" ? data.order : undefined,
	};
}

export function getDocSlugs(): string[] {
	return fs
		.readdirSync(contentDir)
		.filter((f) => f.endsWith(".mdx"))
		.map((f) => f.replace(".mdx", ""));
}

export function getDoc(slug: string): Doc | undefined {
	const filePath = path.join(contentDir, `${slug}.mdx`);
	if (!fs.existsSync(filePath)) {
		return undefined;
	}

	const raw = fs.readFileSync(filePath, "utf8");
	const { data } = matter(raw);

	return {
		slug,
		metadata: normalizeDocMetadata(slug, data as Record<string, unknown>),
	};
}

export function getDocs(): Doc[] {
	const docs = getDocSlugs()
		.map((slug) => getDoc(slug))
		.filter((doc): doc is Doc => doc !== undefined);

	return docs.sort((a, b) => {
		const orderA = a.metadata.order ?? Number.POSITIVE_INFINITY;
		const orderB = b.metadata.order ?? Number.POSITIVE_INFINITY;

		if (orderA !== orderB) {
			return orderA - orderB;
		}

		return a.metadata.title.localeCompare(b.metadata.title);
	});
}
