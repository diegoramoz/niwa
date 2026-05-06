"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const tabs = [
		{ href: "/dashboard/setup", label: "Setup" },
		{ href: "/dashboard/test", label: "Test" },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="flex items-center gap-6 border-gray-200 border-b bg-white px-6 py-3">
				<span className="font-semibold text-gray-800 text-sm">
					Agent Wallet
				</span>
				<div className="flex gap-1">
					{tabs.map((tab) => (
						<Link
							className={`rounded px-3 py-1.5 font-medium text-xs transition-colors ${
								pathname === tab.href
									? "bg-slate-700 text-white"
									: "text-gray-600 hover:bg-gray-100"
							}`}
							href={tab.href}
							key={tab.href}
						>
							{tab.label}
						</Link>
					))}
				</div>
			</nav>
			{children}
		</div>
	);
}
