"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Form, useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { orpc } from "@/lib/orpc";
import { createUserFormSchema } from "./schema";

export function CreateUserForm({ redirect }: { redirect: string }) {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      email: "",
      username: "",
    },
    validators: {
      onChange: createUserFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        toast("Creating user...");
        await orpc.user.create(value);
        toast("User created, redirecting...");
        router.push(redirect);
      } catch {
        toast("Error creating user");
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
      <form.AppField name="email">
        {(field) => (
          <field.TextInput schema={createUserFormSchema.shape.email} />
        )}
      </form.AppField>

      <form.AppField name="username">
        {(field) => (
          <field.TextInput schema={createUserFormSchema.shape.username} />
        )}
      </form.AppField>

      <form.Subscribe selector={(state) => [state.canSubmit]}>
        {([canSubmit]) => (
          <Button disabled={canSubmit === false} type="submit">
            <Save />
            Save
          </Button>
        )}
      </form.Subscribe>
    </Form>
  );
}
