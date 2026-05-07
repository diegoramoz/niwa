import type { Route } from "next";
import Link from "next/link";
import { getDocs } from "@/lib/docs";

export default function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const docs = getDocs();

	return (
		<div className="mx-auto max-w-2xl px-[2lvw] py-8 md:px-0 lg:max-w-5xl">
			<div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8">
				<aside className="hidden lg:block">
					<div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2">
						<p className="mb-3 font-semibold text-sm">Docs</p>
						<nav aria-label="Documentation navigation">
							<ul className="space-y-1">
								{docs.map((doc) => (
									<li key={doc.slug}>
										<Link
											className="block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
											href={`/docs/${doc.slug}` as Route}
										>
											{doc.metadata.title}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>
				</aside>
				<main className="min-w-0">{children}</main>
			</div>
		</div>
	);
}
