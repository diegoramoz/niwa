"use client";

import { Slider } from "@oss/ui/components/slider";
import { useForm } from "@tanstack/react-form";
import { type FlowerParams, flowerParamsMeta } from "./schema";

type SliderMeta = { label: string; min: number; max: number; step: number };

type FlowerControlFormProps = {
	initialValues: FlowerParams;
	onValuesChange: (values: FlowerParams) => void;
};

export function FlowerControlForm({
	initialValues,
	onValuesChange,
}: FlowerControlFormProps) {
	const form = useForm({
		defaultValues: initialValues,
		onSubmit: ({ value }) => {
			onValuesChange(value);
		},
	});

	const handleSliderChange = (field: keyof FlowerParams, value: number) => {
		form.setFieldValue(field, value);
		const currentValues = form.state.values;
		onValuesChange({ ...currentValues, [field]: value });
	};

	const renderSlider = (name: keyof FlowerParams, meta: SliderMeta) => (
		<form.Field key={name} name={name}>
			{(fieldApi) => (
				<SliderRow
					field={name}
					meta={meta}
					onChange={handleSliderChange}
					value={fieldApi.state.value as number}
				/>
			)}
		</form.Field>
	);

	return (
		<div className="h-full space-y-6 overflow-y-auto p-6">
			<h2 className="font-bold text-2xl">Flower Controls</h2>

			{/* Mesh Resolution */}
			<section className="space-y-4">
				<h3 className="font-semibold text-lg">Mesh Resolution</h3>
				{renderSlider("rows", flowerParamsMeta.rows)}
				{renderSlider("cols", flowerParamsMeta.cols)}
				{renderSlider("thetaStep", flowerParamsMeta.thetaStep)}
				{renderSlider("phiStep", flowerParamsMeta.phiStep)}
			</section>

			{/* Flower Shape */}
			<section className="space-y-4">
				<h3 className="font-semibold text-lg">Flower Shape</h3>
				{renderSlider("petalCount", flowerParamsMeta.petalCount)}
				{renderSlider("flowerDiameter", flowerParamsMeta.flowerDiameter)}
				{renderSlider("petalLength", flowerParamsMeta.petalLength)}
				{renderSlider("petalSharpness", flowerParamsMeta.petalSharpness)}
			</section>

			{/* Vertical Shape */}
			<section className="space-y-4">
				<h3 className="font-semibold text-lg">Vertical Shape</h3>
				{renderSlider("flowerHeight", flowerParamsMeta.flowerHeight)}
				{renderSlider(
					"curvatureExponential",
					flowerParamsMeta.curvatureExponential
				)}
				{renderSlider(
					"curvaturePolynomial",
					flowerParamsMeta.curvaturePolynomial
				)}
				{renderSlider("curvaturePower", flowerParamsMeta.curvaturePower)}
				{renderSlider("verticalShift", flowerParamsMeta.verticalShift)}
			</section>

			{/* Surface Texture */}
			<section className="space-y-4">
				<h3 className="font-semibold text-lg">Surface Texture</h3>
				{renderSlider("bumpAmplitude", flowerParamsMeta.bumpAmplitude)}
				{renderSlider("bumpFrequency", flowerParamsMeta.bumpFrequency)}
			</section>

			{/* Colors */}
			<section className="space-y-4">
				<h3 className="font-semibold text-lg">Colors</h3>
				{renderSlider("fillHue", flowerParamsMeta.fillHue)}
				{renderSlider(
					"fillSaturationBase",
					flowerParamsMeta.fillSaturationBase
				)}
				{renderSlider("fillBrightness", flowerParamsMeta.fillBrightness)}
			</section>

			{/* View Controls */}
			<section className="space-y-4">
				<h3 className="font-semibold text-lg">View Controls</h3>
				{renderSlider("rotationX", flowerParamsMeta.rotationX)}
				{renderSlider("orbitControlSpeed", flowerParamsMeta.orbitControlSpeed)}
			</section>
		</div>
	);
}

type SliderRowProps = {
	field: keyof FlowerParams;
	value: number;
	meta: SliderMeta;
	onChange: (field: keyof FlowerParams, value: number) => void;
};

function SliderRow({ field, value, meta, onChange }: SliderRowProps) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<label className="font-medium text-sm" htmlFor={field}>
					{meta.label}
				</label>
				<span className="font-mono text-muted-foreground text-sm">
					{value.toFixed(2)}
				</span>
			</div>
			<Slider
				id={field}
				max={meta.max}
				min={meta.min}
				onValueChange={(newValue) => onChange(field, newValue as number)}
				step={meta.step}
				value={value}
			/>
		</div>
	);
}
