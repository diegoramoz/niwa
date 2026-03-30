import type { ZodType } from "zod/v4";
import { FieldInfo } from "@/components/form/field-info";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { quantityIntl } from "@/lib/number";
import { deleteNonDigits } from "@/validation/utils";
import { useFieldContext } from ".";

export function DecimalInput({
  schema,
  maxCharCount,
}: {
  schema?: ZodType<unknown, unknown>;
  maxCharCount: number;
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

          if (Number(value) === 0) {
            field.handleChange("");
            return;
          }

          const newNumber = `${quantityIntl.format(Number(value) / 100)}`;

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
