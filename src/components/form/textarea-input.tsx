import { useEffect, useRef, useState } from "react";
import type { ZodType } from "zod/v4";
import { FieldInfo } from "@/components/form/field-info";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFilteredInput } from "@/hooks/use-filtered-input";
import { type CharSpec, getCleanTextUnicode } from "@/lib/allowed-chars";
import { formInputMetaSchema } from "@/lib/zod";
import { useFieldContext } from ".";

const MAX_ROWS = 15;

export function TextAreaInput({
  schema,
  rows = 5,
}: {
  rows?: number;
  schema?: ZodType<unknown, unknown>;
}) {
  const field = useFieldContext<string>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dynamicRows, setDynamicRows] = useState(rows);

  let chars: CharSpec | undefined;

  if (typeof schema !== "undefined") {
    chars = formInputMetaSchema.parse(schema.meta()).chars;
  }

  useEffect(() => {
    const value = field.state.value ?? "";
    const lineCount = value.split("\n").length;
    const calculatedRows = Math.min(Math.max(lineCount, rows), MAX_ROWS);
    setDynamicRows(calculatedRows);
  }, [field.state.value, rows]);

  const handleChange = useFilteredInput({
    ref: textareaRef,
    filter: (value) => getCleanTextUnicode({ value, chars }),
    onChange: field.handleChange,
  });

  return (
    <>
      <Label htmlFor={field.name} schema={schema} />
      <Textarea
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={handleChange}
        ref={textareaRef}
        rows={dynamicRows}
        schema={schema}
        value={field.state.value}
      />
      <FieldInfo field={field} />
    </>
  );
}
