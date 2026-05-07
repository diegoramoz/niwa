import type { Route } from "next";
import Link from "next/link";
import { getDocs } from "@/lib/docs";

export default function DocsPage() {
	const docs = getDocs();

	return (
		<section>
			<h1 className="mb-6 font-bold text-2xl">Documentation</h1>
			<p className="mb-6 text-muted-foreground text-sm">
				Guides and references for this project.
			</p>
			<ul className="space-y-4">
				{docs.map((doc) => (
					<li key={doc.slug}>
						<Link className="group block" href={`/docs/${doc.slug}` as Route}>
							<p className="font-medium underline underline-offset-4">
								{doc.metadata.title}
							</p>
							{doc.metadata.description && (
								<p className="text-muted-foreground text-sm">
									{doc.metadata.description}
								</p>
							)}
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
