import type { Route } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export default function BlogPage() {
	const posts = getBlogPosts();
	return (
		<div>
			<h1 className="mb-6 font-bold text-2xl">Blog</h1>
			<ul className="space-y-4">
				{posts.map((post) => (
					<li key={post.slug}>
						<Link className="group block" href={`/blog/${post.slug}` as Route}>
							<p className="font-medium underline underline-offset-4">
								{post.metadata.title}
							</p>
							{post.metadata.description && (
								<p className="text-muted-foreground text-sm">
									{post.metadata.description}
								</p>
							)}
							<time className="text-muted-foreground text-xs">
								{new Date(post.metadata.date).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</time>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
