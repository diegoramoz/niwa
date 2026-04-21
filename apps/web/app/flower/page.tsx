"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FlowerCanvas, useFlowerParams } from "./flower-canvas";
import { parseFlowerParams } from "./schema";

function FlowerContent() {
	const searchParams = useSearchParams();
	// Parse and validate query params, fallback to defaults
	const params = parseFlowerParams(Object.fromEntries(searchParams.entries()));

	// Use refs for type-safe p5 communication
	const paramsRef = useFlowerParams(params);

	return (
		<div className="h-screen w-screen">
			<FlowerCanvas className="h-full w-full" paramsRef={paramsRef} />
		</div>
	);
}

export default function FlowerPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen w-screen items-center justify-center">
					Loading...
				</div>
			}
		>
			<FlowerContent />
		</Suspense>
	);
}
