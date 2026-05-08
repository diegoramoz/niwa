"use client";

import {
	iso36611Alpha2,
	iso36611Alpha2Map,
} from "@oss/shared/enums/country-es";
import { Button } from "@oss/ui/components/button";
import { Form, useAppForm } from "@oss/ui/components/form";
import { generalInfoSchema } from "./general-info-schema";

const compositeCountryItems = iso36611Alpha2.map(
	(code) => `${code}:${iso36611Alpha2Map[code].displayName}` as const
);

const travelDirectionItems: [string, string][] = [
	["entry", "Entrada a la República Dominicana"],
	["exit", "Salida de la República Dominicana"],
];

export function GeneralInfoForm() {
	const form = useAppForm({
		defaultValues: {
			address: "",
			countryCode: "",
			city: "",
			state: "",
			postalCode: "",
			hasLayovers: false,
			travelDirection: "" as string,
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
						items={compositeCountryItems}
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
						items={[["true", "Sí, hace escalas"]]}
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
