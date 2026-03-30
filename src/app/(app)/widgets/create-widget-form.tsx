"use client";

import type { AnyFieldApi, AnyFormApi } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Form, useAppForm } from "@/components/form";
import { FieldInfo } from "@/components/form/field-info";
import { FormFooter } from "@/components/form/form-footer";
import { getFormDefaults } from "@/lib/form-defaults";
import { getEnumOptions } from "@/lib/form-enum-options";
import { orpc } from "@/lib/orpc";
import { createWidgetSchema } from "./create-widget-schema";

export function CreateWidgetForm() {
  const router = useRouter();

  const form = useAppForm({
    schema: createWidgetSchema,
    defaultValues: getFormDefaults(createWidgetSchema),
    action: async (value) => {
      toast("Creating widget...");
      const { widget } = await orpc.widget.create(value);
      toast.success("Widget created.");
      router.push(`/widgets/${widget.nanoId}`);
    },
  });

  const categoryOptions = getEnumOptions(createWidgetSchema.shape.category);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppField name="name">
        {(field) => (
          <div className="mb-4">
            <label
              className="mb-1 block font-medium text-sm"
              htmlFor={field.name}
            >
              Name
            </label>
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              value={field.state.value}
            />
            <FieldInfo field={field as unknown as AnyFieldApi} />
          </div>
        )}
      </form.AppField>

      <form.AppField name="category">
        {(field) => (
          <div className="mb-4">
            <label
              className="mb-1 block font-medium text-sm"
              htmlFor={field.name}
            >
              Category
            </label>
            <select
              className="w-full rounded border px-3 py-2 text-sm"
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value as never)}
              value={field.state.value}
            >
              <option value="">Select a category</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FieldInfo field={field as unknown as AnyFieldApi} />
          </div>
        )}
      </form.AppField>

      <form.AppField name="amount">
        {(field) => (
          <div className="mb-4">
            <label
              className="mb-1 block font-medium text-sm"
              htmlFor={field.name}
            >
              Amount
            </label>
            <input
              className="w-full rounded border px-3 py-2 text-sm"
              id={field.name}
              min={1}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              type="number"
              value={field.state.value}
            />
            <FieldInfo field={field as unknown as AnyFieldApi} />
          </div>
        )}
      </form.AppField>

      <FormFooter form={form as unknown as AnyFormApi} label="Create Widget" />
    </Form>
  );
}
