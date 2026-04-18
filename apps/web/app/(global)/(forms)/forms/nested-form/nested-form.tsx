"use client";

import { useAppForm, withForm } from "@oss/ui/components/form";
import { formOptions } from "@tanstack/react-form";
import { createUserFormSchema } from "app/(global)/(forms)/forms/user/create-user-form";

const formOpts = formOptions({
	defaultValues: {
		name: "",
		email: "",
	},
	validators: {
		onChange: createUserFormSchema,
	},
});

export const ChildForm = withForm({
	...formOpts,
	// Optional, but adds props to the `render` function outside of `form`
	props: {
		title: "Child Form",
	},
	render: ({ form, title }) => {
		return (
			<div>
				<p>{title}</p>
				<form.AppField name="name">
					{(field) => {
						return <field.TextInput schema={createUserFormSchema.shape.name} />;
					}}
				</form.AppField>
				<form.AppField name="email">
					{(field) => {
						return (
							<field.TextInput schema={createUserFormSchema.shape.email} />
						);
					}}
				</form.AppField>
				<form.AppForm>
					<form.SubscribeButton label="Submit" />
				</form.AppForm>
			</div>
		);
	},
});

export const Parent = () => {
	const form = useAppForm({
		...formOpts,
	});

	return <ChildForm form={form} title={"Testing"} />;
};
