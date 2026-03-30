import type { ZodType } from "zod/v4";
import { FieldInfo } from "@/components/form/field-info";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseUsernameInput } from "@/lib/allowed-chars";
import { useFieldContext } from ".";

export function UsernameInput({
  schema,
}: {
  schema?: ZodType<unknown, unknown>;
}) {
  const field = useFieldContext<string>();

  return (
    <>
      <Label htmlFor={field.name} schema={schema} />
      <Input
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(parseUsernameInput(e.target.value))}
        schema={schema}
        value={field.state.value}
      />
      <FieldInfo field={field} schema={schema} />
    </>
  );
}
