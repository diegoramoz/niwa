import { z } from "zod";

/**
 * Zod schema defining all parameters for flower generation
 * Based on the original translated.tsx implementation
 */
export const flowerParamsSchema = z.object({
	// Mesh resolution
	rows: z.number().int().min(10).max(100).default(60),
	cols: z.number().int().min(20).max(200).default(120),
	thetaStep: z.number().min(1).max(5).default(1),
	phiStep: z.number().min(1).max(5).default(1),

	// Flower shape parameters
	petalCount: z.number().int().min(3).max(12).default(5),
	flowerDiameter: z.number().min(50).max(400).default(200),
	petalLength: z.number().min(10).max(150).default(60),
	petalSharpness: z.number().min(0.1).max(2).default(0.4),

	// Vertical shape parameters
	flowerHeight: z.number().min(50).max(500).default(450),
	curvatureExponential: z.number().min(0.1).max(2).default(0.9),
	curvaturePolynomial: z.number().min(0.1).max(2).default(2),
	curvaturePower: z.number().min(0.5).max(3).default(1),
	verticalShift: z.number().min(0).max(400).default(200),

	// Bumpiness parameters
	bumpAmplitude: z.number().min(0).max(10).default(3.6),
	bumpFrequency: z.number().min(0).max(30).default(6.1),

	// Color parameters
	fillHue: z.number().min(0).max(360).default(340),
	fillSaturationBase: z.number().min(0).max(100).default(100),
	fillBrightness: z.number().min(0).max(100).default(100),

	// Canvas and rendering constants
	rotationX: z.number().min(0).max(180).default(60),
	orbitControlSpeed: z.number().min(1).max(10).default(4),
});

export type FlowerParams = z.infer<typeof flowerParamsSchema>;

/**
 * Default flower parameters
 */
export const defaultFlowerParams: FlowerParams = {
	rows: 60,
	cols: 120,
	thetaStep: 1,
	phiStep: 1,
	petalCount: 5,
	flowerDiameter: 200,
	petalLength: 60,
	petalSharpness: 0.4,
	flowerHeight: 300,
	curvatureExponential: 0.8,
	curvaturePolynomial: 0.2,
	curvaturePower: 1.5,
	verticalShift: 200,
	bumpAmplitude: 2.5,
	bumpFrequency: 10,
	fillHue: 340,
	fillSaturationBase: 100,
	fillBrightness: 100,
	rotationX: 60,
	orbitControlSpeed: 4,
};

/**
 * Metadata for form controls
 */
export const flowerParamsMeta = {
	rows: { label: "Rows", min: 10, max: 100, step: 1 },
	cols: { label: "Columns", min: 20, max: 200, step: 1 },
	thetaStep: { label: "Theta Step", min: 1, max: 5, step: 0.1 },
	phiStep: { label: "Phi Step", min: 1, max: 5, step: 0.1 },
	petalCount: { label: "Petal Count", min: 3, max: 12, step: 1 },
	flowerDiameter: { label: "Flower Diameter", min: 50, max: 400, step: 1 },
	petalLength: { label: "Petal Length", min: 10, max: 150, step: 1 },
	petalSharpness: { label: "Petal Sharpness", min: 0.1, max: 2, step: 0.01 },
	flowerHeight: { label: "Flower Height", min: 50, max: 500, step: 1 },
	curvatureExponential: {
		label: "Curvature Exponential",
		min: 0.1,
		max: 2,
		step: 0.01,
	},
	curvaturePolynomial: {
		label: "Curvature Polynomial",
		min: 0.1,
		max: 2,
		step: 0.01,
	},
	curvaturePower: { label: "Curvature Power", min: 0.5, max: 3, step: 0.01 },
	verticalShift: { label: "Vertical Shift", min: 0, max: 400, step: 1 },
	bumpAmplitude: { label: "Bump Amplitude", min: 0, max: 10, step: 0.1 },
	bumpFrequency: { label: "Bump Frequency", min: 0, max: 30, step: 0.1 },
	fillHue: { label: "Hue", min: 0, max: 360, step: 1 },
	fillSaturationBase: { label: "Saturation", min: 0, max: 100, step: 1 },
	fillBrightness: { label: "Brightness", min: 0, max: 100, step: 1 },
	rotationX: { label: "Rotation X", min: 0, max: 180, step: 1 },
	orbitControlSpeed: {
		label: "Orbit Control Speed",
		min: 1,
		max: 10,
		step: 0.1,
	},
} as const;

/**
 * Ordered array of parameter keys (for compact array format)
 */
const PARAM_KEYS_ORDER: (keyof FlowerParams)[] = [
	"rows",
	"cols",
	"thetaStep",
	"phiStep",
	"petalCount",
	"flowerDiameter",
	"petalLength",
	"petalSharpness",
	"flowerHeight",
	"curvatureExponential",
	"curvaturePolynomial",
	"curvaturePower",
	"verticalShift",
	"bumpAmplitude",
	"bumpFrequency",
	"fillHue",
	"fillSaturationBase",
	"fillBrightness",
	"rotationX",
	"orbitControlSpeed",
];

/**
 * Parse query parameters and validate them against the schema
 * Supports both array format (?p=60,120,1,...) and object format (?rows=60&cols=120)
 * Returns validated params or default params if validation fails
 */
export function parseFlowerParams(
	searchParams: Record<string, string | string[] | undefined>
): FlowerParams {
	try {
		// Check for compact array format
		const compactParam = searchParams.p;
		if (typeof compactParam === "string") {
			const values = compactParam.split(",").map((v) => Number.parseFloat(v));
			const params: Record<string, unknown> = {};

			for (let i = 0; i < PARAM_KEYS_ORDER.length && i < values.length; i++) {
				const value = values[i];
				if (!Number.isNaN(value)) {
					params[PARAM_KEYS_ORDER[i]] = value;
				}
			}

			return flowerParamsSchema.parse(params);
		}

		// Fall back to object format
		const params: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(searchParams)) {
			if (typeof value === "string") {
				const num = Number.parseFloat(value);
				if (!Number.isNaN(num)) {
					params[key] = num;
				}
			}
		}

		return flowerParamsSchema.parse(params);
	} catch {
		return defaultFlowerParams;
	}
}

type QueryFormat = "array" | "object";

/**
 * Convert FlowerParams to query string
 * @param params - The flower parameters to encode
 * @param format - 'array' for compact format (?p=60,120,...) or 'object' for verbose (?rows=60&cols=120...)
 */
export function flowerParamsToQueryString(
	params: FlowerParams,
	format: QueryFormat = "array"
): string {
	if (format === "array") {
		// Compact array format - build manually to avoid escaping commas
		const values = PARAM_KEYS_ORDER.map((key) => String(params[key]));
		return `p=${values.join(",")}`;
	}

	// Verbose object format
	const searchParams = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		searchParams.set(key, String(value));
	}

	return searchParams.toString();
}
