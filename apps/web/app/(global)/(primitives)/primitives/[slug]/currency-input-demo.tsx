"use client";

import { Form, useAppForm } from "@oss/ui/components/form";
import { z } from "zod/v4";

const schema = z.object({
	value: z.number().meta({ label: "Amount", placeholder: "$0.00" }),
});

export function CurrencyInputDemo() {
	const form = useAppForm({
		defaultValues: { value: null as number | null },
		validators: { onChange: schema },
		onSubmit: async () => {
			// demo only — no submission action
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
			<form.AppField name="value">
				{(field) => (
					<field.NumberInput
						format={{ style: "currency", currency: "USD" }}
						min={0}
						schema={schema.shape.value}
					/>
				)}
			</form.AppField>
		</Form>
	);
}
