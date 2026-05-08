import { formInputMetaSchema } from "@oss/shared/zod";
import type { ZodType } from "zod/v4";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput as ComboboxInputPrimitive,
	ComboboxItem,
	ComboboxList,
} from "../combobox";
import { Label } from "../label";
import { useFieldContext } from ".";
import { FieldInfo } from "./field-info";

const normalizeSearchText = (value: string) =>
	value
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.trim();

const fuzzyIncludes = (target: string, query: string) => {
	const normalizedTarget = normalizeSearchText(target);
	const normalizedQuery = normalizeSearchText(query);

	if (!normalizedQuery) {
		return true;
	}

	let queryIndex = 0;

	for (const char of normalizedTarget) {
		if (char === normalizedQuery[queryIndex]) {
			queryIndex += 1;
		}

		if (queryIndex >= normalizedQuery.length) {
			return true;
		}
	}

	return false;
};

export function ComboboxInput({
	schema,
	items,
	placeholder,
}: {
	schema?: ZodType<unknown, unknown>;
	items: string[];
	placeholder?: string;
}) {
	const field = useFieldContext<string>();

	let resolvedPlaceholder = placeholder;
	if (
		typeof resolvedPlaceholder === "undefined" &&
		typeof schema !== "undefined"
	) {
		resolvedPlaceholder = formInputMetaSchema.parse(schema.meta()).placeholder;
	}

	return (
		<div>
			<Label htmlFor={field.name} schema={schema} />

			<Combobox
				filter={(value, query) => {
					const [, displayName] = value.split(":");
					if (!displayName) {
						return false;
					}
					return fuzzyIncludes(displayName, query);
				}}
				items={items}
				onValueChange={(e) => e && field.handleChange(e)}
				value={field.state.value}
			>
				<ComboboxInputPrimitive
					id={field.name}
					placeholder={resolvedPlaceholder ?? "Search or select"}
					showClear
				/>
				<ComboboxContent>
					<ComboboxEmpty>No results found.</ComboboxEmpty>
					<ComboboxList>
						{(item) => {
							const [, displayName] = item.split(":");
							return (
								<ComboboxItem key={item} value={item}>
									{displayName}
								</ComboboxItem>
							);
						}}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
			<FieldInfo field={field} />
		</div>
	);
}
