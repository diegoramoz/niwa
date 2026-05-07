import { notFound } from "next/navigation";
import { getDoc, getDocSlugs } from "@/lib/docs";

type Props = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return getDocSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default async function DocPage({ params }: Props) {
	const { slug } = await params;

	const doc = getDoc(slug);
	if (!doc) {
		notFound();
	}

	let DocContent: React.ComponentType;
	try {
		const mod = await import(`@/content/docs/${slug}.mdx`);
		DocContent = mod.default;
	} catch {
		notFound();
	}

	return (
		<article className="leading-relaxed">
			<h1 className="mb-3 font-bold text-4xl leading-tight">
				{doc.metadata.title}
			</h1>
			{doc.metadata.description && (
				<p className="mb-8 text-muted-foreground">{doc.metadata.description}</p>
			)}
			<DocContent />
		</article>
	);
}
