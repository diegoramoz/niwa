import { generateMetadata as _generateMetadata } from "lib/seo";
import type { Metadata, Route } from "next";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export const metadata: Metadata = _generateMetadata({
	title: "Skills",
	description: "A collection of agent skills built by Diego Ramos.",
	path: "/skills",
});

const skills = [
	{
		slug: "name-it",
		name: "name-it",
		tagline: "Generate novel, pronounceable names for anything.",
		tags: ["naming", "branding", "linguistics"],
	},
];

export default function SkillsPage() {
	return (
		<div>
			<div className="mb-2 flex items-center justify-between">
				<h1 className="font-bold text-2xl">Skills</h1>
				<a
					className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
					href="https://github.com/diegoramoz/skills"
					rel="noopener noreferrer"
					target="_blank"
				>
					GitHub <FaGithub />
				</a>
			</div>
			<p className="mb-8 text-muted-foreground text-sm">
				Agent skills by Diego Ramos.
			</p>
			<ul className="space-y-4">
				{skills.map((skill) => (
					<li key={skill.slug}>
						<Link
							className="group block rounded-lg border p-4 transition-colors hover:border-foreground"
							href={`/skills/${skill.slug}` as Route}
						>
							<p className="font-mono font-semibold text-sm">{skill.name}</p>
							<p className="mt-1 text-muted-foreground text-sm">
								{skill.tagline}
							</p>
							<div className="mt-2 flex gap-2">
								{skill.tags.map((tag) => (
									<span
										className="rounded bg-muted px-2 py-0.5 font-mono text-muted-foreground text-xs"
										key={tag}
									>
										{tag}
									</span>
								))}
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
