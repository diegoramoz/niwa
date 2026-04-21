"use client";

import { Button } from "@oss/ui/components/button";
import { Share2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";
import { FlowerCanvas, useFlowerParams } from "../flower-canvas";
import { FlowerControlForm } from "../flower-control-form";
import {
	type FlowerParams,
	flowerParamsToQueryString,
	parseFlowerParams,
} from "../schema";

// Toggle this to switch between compact array format and verbose object format
const USE_COMPACT_URL = true;

function FlowerEditContent() {
	const searchParams = useSearchParams();

	// Parse and validate query params
	const initialParams = parseFlowerParams(
		Object.fromEntries(searchParams.entries())
	);

	// Use refs for type-safe p5 communication
	const paramsRef = useFlowerParams(initialParams);
	const [currentParams, setCurrentParams] =
		useState<FlowerParams>(initialParams);

	// Handle form value changes
	const handleValuesChange = useCallback(
		(newValues: FlowerParams) => {
			paramsRef.current = newValues;
			setCurrentParams(newValues);
		},
		[paramsRef]
	);

	// Handle share button click
	const handleShare = useCallback(() => {
		const queryString = flowerParamsToQueryString(
			currentParams,
			USE_COMPACT_URL ? "array" : "object"
		);
		const shareUrl = `/flower?${queryString}`;
		window.open(shareUrl, "_blank", "noopener,noreferrer");
	}, [currentParams]);

	return (
		<div className="flex h-screen w-screen flex-col md:flex-row">
			{/* Canvas - Top on mobile, Left on desktop */}
			<div className="h-1/2 flex-1 md:h-full">
				<FlowerCanvas className="h-full w-full" paramsRef={paramsRef} />
			</div>

			{/* Controls - Bottom on mobile, Right on desktop */}
			<div className="flex h-1/2 flex-col border-t md:h-full md:w-96 md:border-t-0 md:border-l">
				<div className="flex items-center justify-between border-b p-4">
					<h1 className="font-bold text-xl">Edit Flower</h1>
					<Button onClick={handleShare} size="sm" variant="outline">
						<Share2 className="mr-2 h-4 w-4" />
						Share
					</Button>
				</div>
				<FlowerControlForm
					initialValues={initialParams}
					onValuesChange={handleValuesChange}
				/>
			</div>
		</div>
	);
}

export default function FlowerEditPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-screen w-screen items-center justify-center">
					Loading...
				</div>
			}
		>
			<FlowerEditContent />
		</Suspense>
	);
}
