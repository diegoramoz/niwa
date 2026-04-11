import { env } from "@oss/env/server";

export type OllamaExtraction = {
	merchant: string;
	date: string;
	amount: string;
	currency: string;
	category: string;
	description: string;
	tax: string;
};

const RE_CODE_FENCE_START = /^```(?:json)?\s*/i;
const RE_CODE_FENCE_END = /\s*```\s*$/;

const EXTRACTION_PROMPT = `You are an invoice data extractor. Analyze this invoice or receipt image and extract the following fields. Return ONLY valid JSON matching this schema exactly:
{
  "merchant": "company or seller name",
  "date": "invoice date in YYYY-MM-DD format",
  "amount": "total amount as a decimal string, e.g. 42.50",
  "currency": "3-letter ISO currency code, e.g. USD",
  "category": "expense category such as Food, Travel, Software, Utilities, etc.",
  "description": "one-sentence description of what was purchased",
  "tax": "tax amount as a decimal string, e.g. 3.40 (use 0.00 if not shown)"
}
If a field cannot be determined from the image, use an empty string "". Do not add any text outside the JSON.`;

type OllamaResponse = {
	response?: string;
	error?: string;
	done?: boolean;
};

function safeParseExtraction(raw: string): OllamaExtraction {
	const empty: OllamaExtraction = {
		merchant: "",
		date: "",
		amount: "",
		currency: "",
		category: "",
		description: "",
		tax: "",
	};

	try {
		const cleaned = raw
			.replace(RE_CODE_FENCE_START, "")
			.replace(RE_CODE_FENCE_END, "")
			.trim();

		const parsed = JSON.parse(cleaned) as Record<string, unknown>;

		return {
			merchant: typeof parsed.merchant === "string" ? parsed.merchant : "",
			date: typeof parsed.date === "string" ? parsed.date : "",
			amount: typeof parsed.amount === "string" ? parsed.amount : "",
			currency: typeof parsed.currency === "string" ? parsed.currency : "",
			category: typeof parsed.category === "string" ? parsed.category : "",
			description:
				typeof parsed.description === "string" ? parsed.description : "",
			tax: typeof parsed.tax === "string" ? parsed.tax : "",
		};
	} catch {
		return empty;
	}
}

/**
 * Send an image buffer to the Ollama instance (exposed via Cloudflare Tunnel)
 * and extract structured invoice fields.
 *
 * @param buffer - Raw file bytes (must be an image: JPEG, PNG, or WEBP)
 * @param mimeType - MIME type of the file
 * @param headers - Optional HTTP headers to include in the request (e.g. Cloudflare Access tokens)
 * @throws {Error} if the file is a PDF
 * @throws {Error} if Ollama is unreachable
 */
export async function extractInvoiceFromOllama(
	buffer: Buffer,
	mimeType: string,
	headers?: Record<string, string>
): Promise<OllamaExtraction> {
	if (mimeType === "application/pdf") {
		throw new Error(
			"PDF extraction requires a PDF rendering library (e.g. poppler). " +
				"Please upload a JPG, PNG, or WEBP image of your invoice instead."
		);
	}

	const ollamaUrl = env.OLLAMA_URL ?? "http://localhost:11434";
	const model = env.OLLAMA_MODEL;
	const url = `${ollamaUrl}/api/generate`;
	const base64 = buffer.toString("base64");

	let res: Response;
	try {
		res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
			body: JSON.stringify({
				model,
				prompt: EXTRACTION_PROMPT,
				images: [base64],
				stream: false,
				format: "json",
			}),
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		if (message.includes("ECONNREFUSED") || message.includes("fetch failed")) {
			throw new Error(
				"Ollama is not running or unreachable. Make sure the Cloudflare Tunnel is up " +
					"and OLLAMA_URL points to the tunnel hostname."
			);
		}
		throw new Error(`Failed to reach Ollama: ${message}`);
	}

	if (!res.ok) {
		const body = await res.text().catch(() => "");
		throw new Error(
			`Ollama returned HTTP ${res.status}: ${body || res.statusText}`
		);
	}

	const json = (await res.json()) as OllamaResponse;

	if (json.error) {
		throw new Error(`Ollama error: ${json.error}`);
	}

	return safeParseExtraction(json.response ?? "");
}
