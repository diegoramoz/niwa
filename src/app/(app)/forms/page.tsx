import Link from "next/link";
import { FORMS_NAV } from "@/components/nav/forms";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FormsPage() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="font-bold text-2xl">Forms</h1>
        <p className="text-muted-foreground text-sm">
          Browse the available form examples in this codebase.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FORMS_NAV.map((form) => (
          <Link href={form.href} key={form.href}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="mb-2 flex size-9 items-center justify-center rounded-md bg-muted">
                  <form.icon className="size-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-base">{form.name}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
