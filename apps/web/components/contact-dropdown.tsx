"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@oss/ui/components/dropdown-menu";
import { GithubIcon, MailIcon, TwitterIcon, YoutubeIcon } from "lucide-react";
import type React from "react";

const links = [
	{
		label: "LinkedIn",
		href: "https://linkedin.com/in/ramoz",
		external: true,
		icon: null,
	},
	{
		label: "Resume",
		href: "/resume.pdf",
		external: true,
		icon: null,
	},
	{
		label: "YouTube",
		href: "https://youtube.com/@diegoramozdev",
		external: true,
		icon: YoutubeIcon,
	},
	{
		label: "X",
		href: "https://x.com/zdiegoramos",
		external: true,
		icon: TwitterIcon,
	},
	{
		label: "Email",
		href: "mailto:diego@ramoz.dev",
		external: false,
		icon: MailIcon,
	},
	{
		label: "GitHub",
		href: "https://github.com/diegoramoz",
		external: true,
		icon: GithubIcon,
	},
];

export function ContactDropdown({ trigger }: { trigger: React.ReactElement }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={trigger} />
			<DropdownMenuContent align="center" side="top">
				{links.map((link) => (
					<DropdownMenuItem
						key={link.label}
						render={
							<a
								href={link.href}
								{...(link.external
									? { rel: "noopener noreferrer", target: "_blank" }
									: {})}
							/>
						}
					>
						{link.icon && <link.icon />}
						{link.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
