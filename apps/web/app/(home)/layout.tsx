import Link from "next/link";

export default function HomeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="mx-auto max-w-xl px-[4lvw] py-8 lg:px-0">
			<nav className="mb-8 flex gap-4 text-sm">
				<Link className="underline underline-offset-4" href="/">
					Home
				</Link>
				<Link className="underline underline-offset-4" href="/blog">
					Blog
				</Link>
			</nav>
			{children}
		</div>
	);
}
