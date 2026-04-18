import { execSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

const URL = "https://web.localhost/text";
const OUTPUT_DIR = resolve(process.cwd(), "public/og");
const FRAMES_DIR = resolve(OUTPUT_DIR, "_frames");
const OUTPUT_MP4 = resolve(OUTPUT_DIR, "text.mp4");

const WIDTH = 600;
const HEIGHT = 600;
const FPS = 30;
const DURATION_SEC = 3;
const TOTAL_FRAMES = FPS * DURATION_SEC;

async function main() {
	mkdirSync(FRAMES_DIR, { recursive: true });

	const browser = await chromium.launch();
	const context = await browser.newContext({
		viewport: { width: WIDTH, height: HEIGHT },
		ignoreHTTPSErrors: true,
	});
	const page = await context.newPage();

	await page.goto(URL, { waitUntil: "networkidle" });
	// Wait for the fixed canvas overlay to mount and Three.js to initialise
	await page.waitForSelector("canvas");
	// Hide the Next.js dev indicator
	await page.addStyleTag({
		content: "nextjs-portal { display: none !important; }",
	});
	await page.waitForTimeout(2500);

	type OgWin = { __ogCapture?: boolean; __setOgRotation?: (n: number) => void };

	// Pause auto-rotation
	await page.evaluate(() => {
		(window as unknown as OgWin).__ogCapture = true;
	});

	console.log(`Capturing ${TOTAL_FRAMES} frames...`);

	for (let i = 0; i < TOTAL_FRAMES; i++) {
		// Distribute frames evenly across [0, 2π) so the loop is seamless
		const angle = (i / TOTAL_FRAMES) * Math.PI * 2;

		// Set rotation and wait for Three.js to render in one atomic evaluate —
		// splitting into two calls risks a stale frame being composited between them
		await page.evaluate((a) => {
			(window as unknown as OgWin).__setOgRotation?.(a);
			return new Promise<void>((r) => {
				requestAnimationFrame(() =>
					requestAnimationFrame(() => requestAnimationFrame(() => r()))
				);
			});
		}, angle);

		const framePath = resolve(
			FRAMES_DIR,
			`frame-${String(i).padStart(4, "0")}.png`
		);
		await page.screenshot({
			path: framePath,
			clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
		});

		if (i % 15 === 0) {
			console.log(`  ${i}/${TOTAL_FRAMES}`);
		}
	}

	await browser.close();

	console.log("Encoding MP4...");
	execSync(
		`ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame-%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 28 -preset fast -vf "scale=${WIDTH}:${HEIGHT}" "${OUTPUT_MP4}"`,
		{ stdio: "inherit" }
	);

	rmSync(FRAMES_DIR, { recursive: true });

	const { size } = statSync(OUTPUT_MP4);
	console.log(`Done: ${OUTPUT_MP4} (${(size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
