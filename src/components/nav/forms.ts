import {
  BugIcon,
  CreditCardIcon,
  FileTextIcon,
  LayoutListIcon,
  MailIcon,
  PackageIcon,
  UserIcon,
} from "lucide-react";

export const FORMS_NAV = [
  {
    name: "Credit Card",
    description: "Payment method entry with card number, CVV, and expiry.",
    href: "/forms/credit-card",
    icon: CreditCardIcon,
    activePatterns: ["/forms/credit-card", "/forms/credit-card/*"],
  },
  {
    name: "Contact Emails",
    description: "Dynamic list of email addresses with add/remove controls.",
    href: "/forms/emails",
    icon: MailIcon,
    activePatterns: ["/forms/emails", "/forms/emails/*"],
  },
  {
    name: "Nested Form",
    description: "Demonstrates composing child forms with shared form options.",
    href: "/forms/nested-form",
    icon: LayoutListIcon,
    activePatterns: ["/forms/nested-form", "/forms/nested-form/*"],
  },
  {
    name: "Select Plan",
    description: "Subscription plan selection using a choice input.",
    href: "/forms/plan",
    icon: FileTextIcon,
    activePatterns: ["/forms/plan", "/forms/plan/*"],
  },
  {
    name: "Bug Report",
    description: "Submit a bug report with title and description fields.",
    href: "/forms/report",
    icon: BugIcon,
    activePatterns: ["/forms/report", "/forms/report/*"],
  },
  {
    name: "Create User",
    description: "User creation with username and email validation.",
    href: "/forms/user",
    icon: UserIcon,
    activePatterns: ["/forms/user", "/forms/user/*"],
  },
  {
    name: "Widgets",
    description: "Create and list widgets with category and amount fields.",
    href: "/forms/widgets",
    icon: PackageIcon,
    activePatterns: ["/forms/widgets", "/forms/widgets/*"],
  },
];
