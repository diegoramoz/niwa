import type { ZodType } from "zod/v4";
import { FieldInfo } from "@/components/form/field-info";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type PhoneCountryCode,
  phoneCountryCodes,
  phoneCountryCodesMapping,
} from "@/validation/enums/phone";
import { useFieldContext } from "..";

export function CountryCodeInput({
  schema,
}: {
  schema?: ZodType<unknown, unknown>;
}) {
  const field = useFieldContext<string>();
  return (
    <>
      <Label htmlFor={field.name} schema={schema} />
      <Select
        onOpenChange={(open) => {
          if (open === false) {
            field.handleBlur();
          }
        }}
        onValueChange={(e) => field.handleChange(e as PhoneCountryCode)}
        value={field.state.value}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccione" />
        </SelectTrigger>
        <SelectContent>
          {phoneCountryCodes.map((code) => (
            <SelectItem key={code} value={code}>
              {code} {phoneCountryCodesMapping[code]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldInfo field={field} />
    </>
  );
}
