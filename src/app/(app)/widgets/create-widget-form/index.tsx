"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Form, useAppForm } from "@/components/form";
import { FormFooter } from "@/components/form/form-footer";
import { orpc } from "@/lib/orpc";
import type { WidgetCategory } from "@/server/db/schema";
import { createWidgetSchema } from "./schema";

const categoryItems: [string, string][] = [
  ["basic", "Basic"],
  ["advanced", "Advanced"],
  ["premium", "Premium"],
];

export function CreateWidgetForm() {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      name: "",
      category: "",
      amount: "",
    },
    validators: {
      onChange: createWidgetSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await orpc.widget.create({
          name: value.name,
          category: value.category as WidgetCategory,
          amount: value.amount,
        });
        toast("Widget created!");
        router.push("/widgets/list");
      } catch {
        toast("Error creating widget");
      }
    },
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField name="name">
        {(field) => <field.TextInput schema={createWidgetSchema.shape.name} />}
      </form.AppField>

      <form.AppField name="category">
        {(field) => (
          <field.SelectInput
            items={categoryItems}
            schema={createWidgetSchema.shape.category}
          />
        )}
      </form.AppField>

      <form.AppField name="amount">
        {(field) => (
          <field.TextInput schema={createWidgetSchema.shape.amount} />
        )}
      </form.AppField>

      <FormFooter form={form} label="Create Widget" />
    </Form>
  );
}
