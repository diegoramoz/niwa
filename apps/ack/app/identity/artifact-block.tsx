type ArtifactBlockProps = {
	label: string;
	children: React.ReactNode;
};

export function ArtifactBlock({ label, children }: ArtifactBlockProps) {
	return (
		<div className="space-y-1">
			<p className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
				{label}
			</p>
			<pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-xs leading-relaxed">
				{children}
			</pre>
		</div>
	);
}
