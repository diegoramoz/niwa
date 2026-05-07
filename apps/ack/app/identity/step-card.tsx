type StepCardProps = {
	number: number;
	title: string;
	done: boolean;
	children: React.ReactNode;
};

export function StepCard({ number, title, done, children }: StepCardProps) {
	return (
		<section aria-label={title} className="space-y-6 rounded-lg border p-6">
			<div className="flex items-center gap-3">
				<span
					className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs ${
						done
							? "bg-green-100 text-green-700"
							: "bg-muted text-muted-foreground"
					}`}
				>
					{done ? "✓" : number}
				</span>
				<p className="font-semibold">{title}</p>
			</div>
			{children}
		</section>
	);
}
