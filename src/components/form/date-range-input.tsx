import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Matcher } from "react-day-picker";
import { es } from "react-day-picker/locale";
import type { ZodType } from "zod/v4";
import { FieldInfo } from "@/components/form/field-info";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFieldContext } from ".";

export function DateRangeInput({
  schema,
  modifiers,
}: {
  schema?: ZodType<unknown, unknown>;
  modifiers?: Record<string, Matcher | Matcher[] | undefined> | undefined;
}) {
  const field = useFieldContext<{ from: Date; to: Date }>();

  const { from, to } = field.state.value as {
    from: Date;
    to: Date;
  };

  const buttonText =
    from instanceof Date && to instanceof Date ? (
      `del ${format(from, "PP", { locale: es })} - al ${format(to, "PP", { locale: es })}`
    ) : (
      <span>Pick a date</span>
    );

  return (
    <>
      <Label htmlFor={field.name} schema={schema} />
      <Popover>
        <div>
          <PopoverTrigger>
            <Button
              className="inline-flex w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
              data-empty={from instanceof Date === false}
              variant="outline"
            >
              <CalendarIcon />
              {buttonText}
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-0">
          <Calendar
            locale={es}
            mode="range"
            modifiers={modifiers}
            onSelect={(date) => {
              if (
                date?.from instanceof Date === true &&
                date?.to instanceof Date === true
              ) {
                field.handleChange({
                  from: date.from,
                  to: date.to,
                });
              }
            }}
            selected={{ from, to }}
          />
        </PopoverContent>
      </Popover>
      <FieldInfo field={field} />
    </>
  );
}
