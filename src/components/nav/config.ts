import {
  BlocksIcon,
  HomeIcon,
  LayoutGrid,
  type LucideIcon,
  Receipt,
  WrenchIcon,
} from "lucide-react";

/**
 * Navigation route configuration
 */
export type NavRoute = {
  /** The URL path for this route */
  href: string;
  /** Display name for the navigation item */
  name: string;
  /** Icon component to display */
  icon: LucideIcon;
  /**
   * Array of path patterns that should mark this item as active
   * Supports exact matches and wildcards (e.g., "/contracts/*")
   */
  activePatterns: string[];
};

/**
 * User navigation routes configuration
 */
export const USER_NAV_ROUTES = [
  {
    href: "/dashboard",
    name: "Dashboard",
    icon: HomeIcon,
    activePatterns: ["/dashboard"],
  },
  {
    href: "/forms",
    name: "Forms",
    icon: LayoutGrid,
    activePatterns: ["/forms", "/forms/*"],
  },
  {
    href: "/tools",
    name: "Tools",
    icon: WrenchIcon,
    activePatterns: ["/tools", "/tools/*"],
  },
  {
    href: "/primitives",
    name: "Primitives",
    icon: BlocksIcon,
    activePatterns: ["/primitives", "/primitives/*"],
  },
] as const satisfies readonly NavRoute[];

/**
 * Admin navigation routes configuration
 */
export const ADMIN_NAV_ROUTES = [
  {
    href: "/dashboard",
    name: "Dashboard",
    icon: HomeIcon,
    activePatterns: ["/dashboard"],
  },
  {
    href: "/invoices",
    name: "Invoices",
    icon: Receipt,
    activePatterns: ["/invoices", "/invoices/*"],
  },
] as const satisfies readonly NavRoute[];

export type NavRoutes = typeof USER_NAV_ROUTES | typeof ADMIN_NAV_ROUTES;

/**
 * Check if a pathname matches any of the active patterns
 * @param pathname Current pathname
 * @param patterns Array of patterns to match against
 * @returns true if the pathname matches any pattern
 */
export function isRouteActive(pathname: string, patterns: string[]) {
  return patterns.some((pattern) => {
    // Exact match
    if (pattern === pathname) {
      return true;
    }

    // Wildcard match (e.g., "/contracts/*" matches "/contracts/123")
    if (pattern.endsWith("/*")) {
      const basePattern = pattern.slice(0, -2);
      return pathname === basePattern || pathname.startsWith(`${basePattern}/`);
    }

    return false;
  });
}
