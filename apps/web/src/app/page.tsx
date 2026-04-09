"use client";

import { APP } from "@oss/shared/metadata";
import { Wireframe } from "@oss/ui/components/wireframe";
import { UserNavigation } from "@/components/navigation";

export default function Home() {
	return (
		<Wireframe>
			<UserNavigation />
			<main className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-4">
				<div className="text-center">
					<h1 className="font-bold text-3xl tracking-tight">Stack</h1>
					<p className="mt-2 text-muted-foreground text-sm">
						A modern full-stack Next.js starter
					</p>
					<a
						className="text-muted-foreground text-sm underline underline-offset-4 transition-colors hover:text-foreground"
						href={APP.github.url}
						rel="noreferrer"
						target="_blank"
					>
						{APP.github.repo}
					</a>
				</div>

				<dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
					{[
						{ label: "Framework", value: "Next.js 16 + React 19" },
						{ label: "Language", value: "TypeScript 6" },
						{ label: "Styling", value: "Tailwind CSS v4" },
						{ label: "Components", value: "shadcn/ui + Base UI" },
						{ label: "Database", value: "PostgreSQL + Drizzle ORM" },
						{ label: "API", value: "oRPC (type-safe RPC)" },
						{ label: "Forms", value: "TanStack Form + Zod v4" },
						{ label: "Tables", value: "TanStack Table" },
						{ label: "PWA", value: "Serwist (Turbopack)" },
						{ label: "Testing", value: "Vitest" },
						{ label: "Linting", value: "Biome + Ultracite" },
					].map(({ label, value }) => (
						<div key={label}>
							<dt className="text-muted-foreground">{label}</dt>
							<dd className="font-medium">{value}</dd>
						</div>
					))}
				</dl>
			</main>
		</Wireframe>
	);
}
