type DemoPlaceholderProps = {
	title: string;
	description: string;
	command: string;
};

export function DemoPlaceholder({
	title,
	description,
	command,
}: DemoPlaceholderProps) {
	return (
		<div className="mx-auto flex min-h-[calc(100dvh-12rem)] w-full max-w-4xl items-center px-4 py-10 md:px-6">
			<section className="w-full rounded-2xl border bg-card p-6 shadow-sm md:p-8">
				<div className="space-y-3">
					<p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.24em]">
						Coming soon
					</p>
					<h1 className="font-semibold text-3xl tracking-tight md:text-4xl">
						{title}
					</h1>
					<p className="max-w-2xl text-base text-muted-foreground leading-7">
						{description}
					</p>
				</div>

				<div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
					<div className="rounded-xl border bg-muted/40 p-4">
						<p className="font-medium text-sm">CLI demo target</p>
						<p className="mt-2 text-muted-foreground text-sm">
							This route is reserved for the interactive walkthrough that
							matches the CLI demo command below.
						</p>
					</div>
					<code className="rounded-xl border bg-background px-4 py-3 font-mono text-sm">
						{command}
					</code>
				</div>
			</section>
		</div>
	);
}
