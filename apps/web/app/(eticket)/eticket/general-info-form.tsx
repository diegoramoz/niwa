"use client";

import { countries } from "@oss/shared/enums/country";
import { Button } from "@oss/ui/components/button";
import { Form, useAppForm } from "@oss/ui/components/form";
import { generalInfoSchema } from "./general-info-schema";

const travelDirectionItems: [string, string][] = [
	["entry", "Entrada a la República Dominicana"],
	["exit", "Salida de la República Dominicana"],
];

export function GeneralInfoForm() {
	const form = useAppForm({
		defaultValues: {
			address: "",
			countryCode: {
				id: "",
				value: "",
				label: "",
			},
			city: "",
			state: "",
			postalCode: "",
			hasLayovers: "false",
			travelDirection: "",
		},
		validators: {
			onChange: generalInfoSchema,
		},
		onSubmit: ({ value }) => {
			// front-end only for now
			console.log(value);
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
			<form.AppField name="address">
				{(field) => (
					<field.TextInput schema={generalInfoSchema.shape.address} />
				)}
			</form.AppField>

			<form.AppField name="countryCode">
				{(field) => (
					<field.ComboboxInput
						items={countries}
						schema={generalInfoSchema.shape.countryCode}
					/>
				)}
			</form.AppField>

			<form.AppField name="city">
				{(field) => <field.TextInput schema={generalInfoSchema.shape.city} />}
			</form.AppField>

			<form.AppField name="state">
				{(field) => <field.TextInput schema={generalInfoSchema.shape.state} />}
			</form.AppField>

			<form.AppField name="postalCode">
				{(field) => (
					<field.TextInput schema={generalInfoSchema.shape.postalCode} />
				)}
			</form.AppField>

			<form.AppField name="hasLayovers">
				{(field) => (
					<field.ChoiceInput
						items={[
							["true", "Con escalas"],
							["false", "Sin escalas"],
						]}
						mode="single"
						schema={generalInfoSchema.shape.hasLayovers}
					/>
				)}
			</form.AppField>

			<form.AppField name="travelDirection">
				{(field) => (
					<field.ChoiceInput
						items={travelDirectionItems}
						mode="single"
						schema={generalInfoSchema.shape.travelDirection}
					/>
				)}
			</form.AppField>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<Button disabled={canSubmit === false} type="submit">
						Siguiente
					</Button>
				)}
			</form.Subscribe>
		</Form>
	);
}
