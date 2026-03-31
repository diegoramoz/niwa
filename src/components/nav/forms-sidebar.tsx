"use client";

import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isRouteActive } from "@/components/nav/config";
import { Item, ItemGroup, ItemMedia } from "@/components/ui/item";
import { WireframeSidebar } from "@/components/ui/wireframe";
import { cn } from "@/lib/utils";
import { FORMS_NAV } from "./forms";

export function FormsSidebar() {
  const pathname = usePathname();

  return (
    <WireframeSidebar className="border-r bg-background" position="left">
      <div className="flex h-full flex-col gap-2 p-3">
        <div className="px-3 py-2">
          <p className="font-semibold text-sm">Forms</p>
          <p className="text-muted-foreground text-xs">Component examples</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <ItemGroup>
            {FORMS_NAV.map((item) => {
              const isActive = isRouteActive(pathname, item.activePatterns);
              return (
                <Item
                  className={cn(
                    "hover:bg-muted",
                    isActive && "bg-muted font-medium"
                  )}
                  key={item.href}
                  render={<Link href={item.href} />}
                  size="sm"
                >
                  <ItemMedia variant="icon">
                    <item.icon
                      className={cn(
                        "size-4",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}
                    />
                  </ItemMedia>
                  <span
                    className={cn(
                      "text-sm",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </span>
                </Item>
              );
            })}
          </ItemGroup>
        </nav>

        <a
          className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
          href="https://github.com/zdiegoramos/frontend"
          rel="noopener noreferrer"
          target="_blank"
        >
          <SiGithub className="size-4 shrink-0" />
          <span>View on GitHub</span>
        </a>
      </div>
    </WireframeSidebar>
  );
}
