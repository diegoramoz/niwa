import { useRef } from "react";
import type { ZodType } from "zod/v4";
import { FieldInfo } from "@/components/form/field-info";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFilteredInput } from "@/hooks/use-filtered-input";
import { type CharSpec, getCleanTextUnicode } from "@/lib/allowed-chars";
import { formInputMetaSchema } from "@/lib/zod";
import { useFieldContext } from ".";

export function TextInput({ schema }: { schema?: ZodType<unknown, unknown> }) {
  const field = useFieldContext<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  let chars: CharSpec | undefined;

  if (typeof schema !== "undefined") {
    chars = formInputMetaSchema.parse(schema.meta()).chars;
  }

  const handleChange = useFilteredInput({
    ref: inputRef,
    filter: (value) => getCleanTextUnicode({ value, chars }),
    onChange: field.handleChange,
  });

  return (
    <>
      <Label htmlFor={field.name} schema={schema} />
      <Input
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={handleChange}
        ref={inputRef}
        schema={schema}
        value={field.state.value}
      />
      <FieldInfo field={field} />
    </>
  );
}
