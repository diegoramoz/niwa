"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AmortizationInputValues {
  annualInterestRate: string;
  loanAmount: string;
  termMonths: string;
  termYears: string;
}

export const DEFAULT_INPUTS: AmortizationInputValues = {
  loanAmount: "200000",
  termYears: "30",
  termMonths: "0",
  annualInterestRate: "6",
};

interface Props {
  onChange: (values: AmortizationInputValues) => void;
  onClear: () => void;
  values: AmortizationInputValues;
}

export function AmortizationInputs({ values, onChange, onClear }: Props) {
  function set(field: keyof AmortizationInputValues) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...values, [field]: e.target.value });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="loanAmount">Loan Amount</Label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground text-sm">
            $
          </span>
          <Input
            className="pl-6"
            id="loanAmount"
            inputMode="decimal"
            min={0}
            onChange={set("loanAmount")}
            placeholder="200000"
            type="number"
            value={values.loanAmount}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="termYears">Term (Years)</Label>
          <Input
            id="termYears"
            inputMode="numeric"
            min={0}
            onChange={set("termYears")}
            placeholder="30"
            type="number"
            value={values.termYears}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="termMonths">Term (Months)</Label>
          <Input
            id="termMonths"
            inputMode="numeric"
            max={11}
            min={0}
            onChange={set("termMonths")}
            placeholder="0"
            type="number"
            value={values.termMonths}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="annualInterestRate">Annual Interest Rate</Label>
        <div className="relative">
          <Input
            className="pr-7"
            id="annualInterestRate"
            inputMode="decimal"
            min={0}
            onChange={set("annualInterestRate")}
            placeholder="6"
            type="number"
            value={values.annualInterestRate}
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground text-sm">
            %
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={onClear} type="button" variant="outline">
          Clear
        </Button>
      </div>
    </div>
  );
}
