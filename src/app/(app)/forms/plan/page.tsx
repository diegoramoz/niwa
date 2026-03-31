"use client";

import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";
import { SelectPlanForm } from "./plan-form";

export default function Home() {
  return (
    <WireframeDefault>
      <Providers>
        <main className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-4">
          <div className="space-y-1 text-center">
            <h1 className="font-bold text-2xl">Choose Your Plan</h1>
            <p className="text-muted-foreground text-sm">
              Select the subscription that works for you
            </p>
          </div>
          <SelectPlanForm userId={1n} />
        </main>
      </Providers>
    </WireframeDefault>
  );
}
