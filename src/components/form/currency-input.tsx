import type { ZodType } from "zod/v4";
import { FieldInfo } from "@/components/form/field-info";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usdIntl } from "@/lib/number";
import { deleteNonDigits } from "@/validation/utils";
import { useFieldContext } from ".";

export function CurrencyInput({
  schema,
  maxCharCount,
  minValueCents,
  maxValueCents,
}: {
  schema?: ZodType<unknown, unknown>;
  maxCharCount: number;
  minValueCents?: number;
  maxValueCents?: number;
}) {
  const field = useFieldContext<string>();

  return (
    <>
      <Label htmlFor={field.name} schema={schema} />
      <Input
        autoComplete="off"
        autoCorrect="off"
        id={field.name}
        inputMode="numeric"
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => {
          const value = deleteNonDigits(e.target.value).slice(0, maxCharCount);

          if (value.length === 0) {
            field.handleChange("");
            return;
          }

          let cents = Number(value);

          if (cents === 0) {
            field.handleChange("");
            return;
          }

          if (typeof minValueCents === "number" && cents < minValueCents) {
            cents = minValueCents;
          }

          if (typeof maxValueCents === "number" && cents > maxValueCents) {
            cents = maxValueCents;
          }

          if (cents === 0) {
            field.handleChange("");
            return;
          }

          const newNumber = `${usdIntl.format(cents / 100)}`;

          field.handleChange(newNumber);
        }}
        schema={schema}
        spellCheck="false"
        type="text"
        value={field.state.value}
      />
      <FieldInfo field={field} />
    </>
  );
}
