export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="mx-auto max-w-2xl px-[2lvw] py-8 md:px-0">{children}</div>
	);
}
