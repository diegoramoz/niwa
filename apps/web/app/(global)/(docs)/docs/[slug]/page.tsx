import { notFound } from "next/navigation";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";

type Props = {
	params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
	return getBlogSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default async function BlogPostPage({ params }: Props) {
	const { slug } = await params;

	const post = getBlogPost(slug);
	if (!post) {
		notFound();
	}

	let Post: React.ComponentType;
	try {
		const mod = await import(`@/content/blog/${slug}.mdx`);
		Post = mod.default;
	} catch {
		notFound();
	}

	return (
		<article className="leading-relaxed">
			<h1 className="mb-3 font-bold text-4xl leading-tight">
				{post.metadata.title}
			</h1>
			<time className="text-muted-foreground text-sm">
				{new Date(post.metadata.date).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})}
			</time>
			<Post />
		</article>
	);
}
