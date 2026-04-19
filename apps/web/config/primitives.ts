import type { NavRoute } from "@oss/ui/hooks/use-nav-routes";
import {
	AlignLeftIcon,
	CalendarDaysIcon,
	CalendarRangeIcon,
	ChevronDownIcon,
	CreditCardIcon,
	DollarSignIcon,
	HashIcon,
	KeyRoundIcon,
	ListChecksIcon,
	PhoneIcon,
	ShieldIcon,
	TypeIcon,
	UserCircleIcon,
} from "lucide-react";

export const PRIMITIVES_NAV = [
	{
		name: "Card Number Input",
		description: "Formats a 16-digit payment card number as groups of four.",
		href: "/primitives/card-number-input",
		icon: CreditCardIcon,
		activePatterns: [
			"/primitives/card-number-input",
			"/primitives/card-number-input/*",
		],
	},
	{
		name: "Choice Input",
		description:
			"Toggle-card group for single or multiple selections from a list.",
		href: "/primitives/choice-input",
		icon: ListChecksIcon,
		activePatterns: ["/primitives/choice-input", "/primitives/choice-input/*"],
	},
	{
		name: "Country Code Input",
		description: "Dropdown selector for international telephone country codes.",
		href: "/primitives/country-code-input",
		icon: PhoneIcon,
		activePatterns: [
			"/primitives/country-code-input",
			"/primitives/country-code-input/*",
		],
	},
	{
		name: "Currency Input",
		description:
			"Numeric field that formats and displays values as US dollar amounts on blur.",
		href: "/primitives/currency-input",
		icon: DollarSignIcon,
		activePatterns: [
			"/primitives/currency-input",
			"/primitives/currency-input/*",
		],
	},
	{
		name: "CVV Input",
		description: "Masked 3-4 digit security code field for payment cards.",
		href: "/primitives/cvv-input",
		icon: ShieldIcon,
		activePatterns: ["/primitives/cvv-input", "/primitives/cvv-input/*"],
	},
	{
		name: "Date Input",
		description: "Popover calendar picker for selecting a single date.",
		href: "/primitives/date-input",
		icon: CalendarDaysIcon,
		activePatterns: ["/primitives/date-input", "/primitives/date-input/*"],
	},
	{
		name: "Date Range Input",
		description: "Popover calendar picker for selecting a start and end date.",
		href: "/primitives/date-range-input",
		icon: CalendarRangeIcon,
		activePatterns: [
			"/primitives/date-range-input",
			"/primitives/date-range-input/*",
		],
	},
	{
		name: "Decimal Input",
		description:
			"Numeric field that formats values with two decimal places on blur (e.g. quantities).",
		href: "/primitives/decimal-input",
		icon: HashIcon,
		activePatterns: [
			"/primitives/decimal-input",
			"/primitives/decimal-input/*",
		],
	},
	{
		name: "Phone Number Input",
		description:
			"US phone number field with automatic (NXX) NXX-XXXX formatting.",
		href: "/primitives/phone-number-input",
		icon: PhoneIcon,
		activePatterns: [
			"/primitives/phone-number-input",
			"/primitives/phone-number-input/*",
		],
	},
	{
		name: "Select Input",
		description: "Dropdown select for choosing one option from a fixed list.",
		href: "/primitives/select-input",
		icon: ChevronDownIcon,
		activePatterns: ["/primitives/select-input", "/primitives/select-input/*"],
	},
	{
		name: "Text Area Input",
		description:
			"Auto-growing multi-line text field with optional character filters.",
		href: "/primitives/text-area-input",
		icon: AlignLeftIcon,
		activePatterns: [
			"/primitives/text-area-input",
			"/primitives/text-area-input/*",
		],
	},
	{
		name: "Text Input",
		description:
			"A single-line text field with optional character constraints.",
		href: "/primitives/text-input",
		icon: TypeIcon,
		activePatterns: ["/primitives/text-input", "/primitives/text-input/*"],
	},
	{
		name: "Text Input Raw",
		description:
			"Minimal unfiltered text input that accepts its own field context hook.",
		href: "/primitives/text-input-raw",
		icon: KeyRoundIcon,
		activePatterns: [
			"/primitives/text-input-raw",
			"/primitives/text-input-raw/*",
		],
	},
	{
		name: "Username Input",
		description:
			"Text field that enforces lowercase alphanumeric username formatting.",
		href: "/primitives/username-input",
		icon: UserCircleIcon,
		activePatterns: [
			"/primitives/username-input",
			"/primitives/username-input/*",
		],
	},
] as const satisfies readonly NavRoute[];
