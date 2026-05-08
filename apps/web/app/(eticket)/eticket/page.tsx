import { GeneralInfoForm } from "./general-info-form";

export default function Page() {
	return (
		<main className="mx-auto max-w-2xl px-4 py-8">
			<h1 className="mb-2 font-bold text-3xl uppercase">Información general</h1>
			<p className="mb-8 text-muted-foreground text-sm">
				Los campos marcados con asterisco rojo son obligatorios (
				<span className="text-destructive">*</span>)
			</p>
			<GeneralInfoForm />
		</main>
	);
}
