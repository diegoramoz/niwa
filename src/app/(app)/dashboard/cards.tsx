import {
  type LucideIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatCard = {
  title: string;
  value: string;
  trend: "up" | "down";
  trendValue: string;
  trendLabel: string;
  description: string;
};

const stats: StatCard[] = [
  {
    title: "Total Revenue",
    value: "$1,250.00",
    trend: "up",
    trendValue: "+12.5%",
    trendLabel: "Trending up this month",
    description: "Visitors for the last 6 months",
  },
  {
    title: "New Customers",
    value: "1,234",
    trend: "down",
    trendValue: "-20%",
    trendLabel: "Down 20% this period",
    description: "Acquisition needs attention",
  },
  {
    title: "Active Accounts",
    value: "45,678",
    trend: "up",
    trendValue: "+12.5%",
    trendLabel: "Strong user retention",
    description: "Engagement exceed targets",
  },
  {
    title: "Growth Rate",
    value: "4.5%",
    trend: "up",
    trendValue: "+4.5%",
    trendLabel: "Steady performance increase",
    description: "Meets growth projections",
  },
];

export function StatCard({ stat }: { stat: StatCard }) {
  const { title, value, trend, trendValue, trendLabel, description } = stat;
  const Icon: LucideIcon = trend === "up" ? TrendingUpIcon : TrendingDownIcon;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground">
          {title}
        </CardTitle>
        <CardAction>
          <Badge className="gap-1" variant="outline">
            <Icon className="size-3.5" />
            {trendValue}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span className="font-semibold text-4xl tracking-tight">{value}</span>
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1.5 font-semibold text-sm">
            {trendLabel}
            <Icon className="size-4" />
          </span>
          <span className="text-muted-foreground text-sm">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </div>
  );
}
