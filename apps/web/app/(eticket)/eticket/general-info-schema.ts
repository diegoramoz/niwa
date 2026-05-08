import { z } from "zod";

export const generalInfoSchema = z.object({
	address: z
		.string()
		.min(1)
		.meta({ label: "Dirección permanente / residencia" }),
	countryCode: z
		.object({
			id: z.string(),
			label: z.string(),
			value: z.string(),
		})
		.meta({ label: "País de residencia" }),
	city: z.string().min(1).meta({ label: "Ciudad" }),
	state: z.string().min(1).meta({ label: "Estado" }),
	postalCode: z.string().meta({ label: "Código postal" }),
	hasLayovers: z.stringbool().meta({ label: "¿Hace escalas en otros países?" }),
	travelDirection: z
		.enum(["entry", "exit"])
		.meta({ label: "Dirección de viaje" }),
});

export type GeneralInfoFormValues = z.infer<typeof generalInfoSchema>;
