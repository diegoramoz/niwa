"use client";

import { useEffect, useState } from "react";
import type { AmortizationInputValues } from "./components/amortization-inputs";
import {
  AmortizationInputs,
  DEFAULT_INPUTS,
} from "./components/amortization-inputs";
import { AmortizationLineChart } from "./components/amortization-line-chart";
import { AmortizationPieChart } from "./components/amortization-pie-chart";
import { AmortizationSummary } from "./components/amortization-summary";
import { AmortizationTable } from "./components/amortization-table";
import {
  type AmortizationResult,
  calculateAmortization,
} from "./lib/amortization";

const STORAGE_KEY = "amortization-inputs";

function loadInputs(): AmortizationInputValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_INPUTS;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "loanAmount" in parsed &&
      "termYears" in parsed &&
      "termMonths" in parsed &&
      "annualInterestRate" in parsed
    ) {
      return parsed as AmortizationInputValues;
    }
  } catch {
    // malformed JSON — fall through to defaults
  }
  return DEFAULT_INPUTS;
}

export default function AmortizationPage() {
  const [inputs, setInputs] = useState<AmortizationInputValues>(DEFAULT_INPUTS);
  const [result, setResult] = useState<AmortizationResult | null>(null);

  useEffect(() => {
    setInputs(loadInputs());
  }, []);

  useEffect(() => {
    const loanAmount = Number.parseFloat(inputs.loanAmount);
    const termYears = Number.parseInt(inputs.termYears, 10);
    const termMonths = Number.parseInt(inputs.termMonths, 10);
    const annualInterestRate = Number.parseFloat(inputs.annualInterestRate);

    if (
      Number.isNaN(loanAmount) ||
      Number.isNaN(termYears) ||
      Number.isNaN(termMonths) ||
      Number.isNaN(annualInterestRate) ||
      loanAmount <= 0 ||
      termYears * 12 + termMonths <= 0 ||
      annualInterestRate < 0
    ) {
      setResult(null);
      return;
    }

    const computed = calculateAmortization({
      loanAmount,
      termYears,
      termMonths,
      annualInterestRate,
    });
    setResult(computed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  function handleClear() {
    setInputs(DEFAULT_INPUTS);
    // Intentionally does NOT clear localStorage per spec
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-bold text-2xl">Amortization Calculator</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Calculate your loan repayment schedule instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <AmortizationInputs
            onChange={setInputs}
            onClear={handleClear}
            values={inputs}
          />
        </div>

        <div className="flex flex-col gap-6">
          {result ? (
            <>
              <AmortizationSummary result={result} />
              <AmortizationPieChart
                totalInterest={result.totalInterest}
                totalPayments={result.totalPayments}
              />
              <AmortizationLineChart
                monthlyPayment={result.monthlyPayment}
                yearlySchedule={result.yearlySchedule}
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed p-8 text-center text-muted-foreground text-sm">
              Enter valid loan details to see your repayment schedule.
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="mt-6">
          <AmortizationTable
            monthlySchedule={result.monthlySchedule}
            yearlySchedule={result.yearlySchedule}
          />
        </div>
      )}
    </main>
  );
}
