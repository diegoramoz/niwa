"use client";

import { P5Canvas } from "components/p5";
import type p5 from "p5";
import { useCallback, useRef } from "react";
import type { FlowerParams } from "./schema";
import { defaultFlowerParams } from "./schema";

const STROKE_WEIGHT = 0;
const BACKGROUND_HUE = 0;
const BACKGROUND_SATURATION = 0;
const BACKGROUND_BRIGHTNESS = 0;

type FlowerCanvasProps = {
	paramsRef: React.MutableRefObject<FlowerParams>;
	className?: string;
};

function calculateVertex(
	p: p5,
	theta: number,
	phi: number,
	params: FlowerParams,
	effectiveRows: number,
	effectiveCols: number
): p5.Vector {
	const petalShape = p.pow(
		p.abs(p.sin(((params.petalCount / 2) * phi * 360) / effectiveCols)),
		params.petalSharpness
	);
	const r =
		((params.petalLength * petalShape + params.flowerDiameter) * theta) /
		effectiveRows;
	const x = r * p.cos((phi * 360) / effectiveCols);
	const y = r * p.sin((phi * 360) / effectiveCols);
	const normalizedR = p.abs(r / 100);
	const verticalShape =
		params.flowerHeight *
		p.pow(
			Math.E,
			-params.curvatureExponential *
				p.pow(p.abs(normalizedR), params.curvaturePower)
		) *
		p.pow(p.abs(normalizedR), params.curvaturePolynomial);
	const bumpiness =
		1 +
		params.bumpAmplitude *
			p.pow(normalizedR, 2) *
			p.sin((params.bumpFrequency * (phi * 360)) / effectiveCols);
	return p.createVector(x, y, verticalShape - params.verticalShift + bumpiness);
}

function buildMesh(
	p: p5,
	params: FlowerParams,
	effectiveRows: number,
	effectiveCols: number
): p5.Vector[][] {
	const mesh: p5.Vector[][] = [];
	const thetaValues = Array.from(
		{ length: Math.ceil(effectiveRows / params.thetaStep) },
		(_, i) => i * params.thetaStep
	);
	for (const theta of thetaValues) {
		mesh.push([]);
		const phiValues = Array.from(
			{ length: Math.ceil(effectiveCols / params.phiStep) },
			(_, i) => i * params.phiStep
		);
		for (const phi of phiValues) {
			mesh[theta]?.push(
				calculateVertex(p, theta, phi, params, effectiveRows, effectiveCols)
			);
		}
	}
	return mesh;
}

function renderQuad(
	p: p5,
	a: p5.Vector,
	b: p5.Vector,
	c: p5.Vector,
	d: p5.Vector
) {
	p.beginShape();
	p.vertex(a.x, a.y, a.z);
	p.vertex(b.x, b.y, b.z);
	p.vertex(c.x, c.y, c.z);
	p.vertex(d.x, d.y, d.z);
	p.endShape(p.CLOSE);
}

function renderInteriorQuad(
	p: p5,
	thetaRow: p5.Vector[],
	nextThetaRow: p5.Vector[],
	phi: number,
	cur: p5.Vector
) {
	const nextPhi = thetaRow[phi + 1];
	const nextTheta = nextThetaRow[phi];
	const nextBoth = nextThetaRow[phi + 1];
	if (nextPhi && nextTheta && nextBoth) {
		renderQuad(p, cur, nextTheta, nextBoth, nextPhi);
	}
}

function renderWrapQuad(
	p: p5,
	thetaRow: p5.Vector[],
	nextThetaRow: p5.Vector[],
	phi: number,
	cur: p5.Vector
) {
	const firstPhi = thetaRow[0];
	const nextThetaFirst = nextThetaRow[0];
	const nextThetaCur = nextThetaRow[phi];
	if (firstPhi && nextThetaFirst && nextThetaCur) {
		renderQuad(p, cur, firstPhi, nextThetaFirst, nextThetaCur);
	}
}

function renderThetaRow(
	p: p5,
	v: p5.Vector[][],
	theta: number,
	thetaRow: p5.Vector[],
	params: FlowerParams
) {
	const saturation = params.fillSaturationBase - theta;
	p.fill(params.fillHue, saturation, params.fillBrightness);
	const nextThetaRow = v[theta + 1];
	const isNotLastTheta = theta < v.length - 1;
	for (let phi = 0; phi < thetaRow.length; phi++) {
		const cur = thetaRow[phi];
		if (!cur) {
			continue;
		}
		if (isNotLastTheta && phi < thetaRow.length - 1 && nextThetaRow) {
			renderInteriorQuad(p, thetaRow, nextThetaRow, phi, cur);
		} else if (isNotLastTheta && phi === thetaRow.length - 1 && nextThetaRow) {
			renderWrapQuad(p, thetaRow, nextThetaRow, phi, cur);
		}
	}
}

function renderMesh(p: p5, v: p5.Vector[][], params: FlowerParams) {
	for (let theta = 0; theta < v.length; theta++) {
		const thetaRow = v[theta];
		if (!thetaRow) {
			continue;
		}
		renderThetaRow(p, v, theta, thetaRow, params);
	}
}

export function FlowerCanvas({ paramsRef, className }: FlowerCanvasProps) {
	const vRef = useRef<p5.Vector[][]>([]);
	const cachedParamsRef = useRef<string>("");
	const isInteractingRef = useRef(false);
	const interactionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	const setup = useCallback((p: p5, height: number, width: number) => {
		p.createCanvas(width, height, p.WEBGL);
		p.angleMode(p.DEGREES);
		p.colorMode(p.HSB, 360, 100, 100);
		p.noStroke();
		if (STROKE_WEIGHT > 0) {
			p.stroke(0);
			p.strokeWeight(STROKE_WEIGHT);
		}
		p.smooth();
	}, []);

	const draw = useCallback(
		(p: p5) => {
			const params = paramsRef.current;

			if (p.mouseIsPressed || p.touches.length > 0) {
				isInteractingRef.current = true;
				clearTimeout(interactionTimeoutRef.current);
				interactionTimeoutRef.current = setTimeout(() => {
					isInteractingRef.current = false;
				}, 100);
			}

			const qualityMultiplier = isInteractingRef.current ? 0.5 : 1;
			const effectiveRows = Math.ceil(params.rows * qualityMultiplier);
			const effectiveCols = Math.ceil(params.cols * qualityMultiplier);
			const cacheKey = `${effectiveRows}-${effectiveCols}-${params.thetaStep}-${params.phiStep}-${params.petalCount}-${params.flowerDiameter}-${params.petalLength}-${params.petalSharpness}-${params.flowerHeight}-${params.curvatureExponential}-${params.curvaturePolynomial}-${params.curvaturePower}-${params.verticalShift}-${params.bumpAmplitude}-${params.bumpFrequency}`;

			if (cachedParamsRef.current !== cacheKey) {
				vRef.current = buildMesh(p, params, effectiveRows, effectiveCols);
				cachedParamsRef.current = cacheKey;
			}

			p.background(
				BACKGROUND_HUE,
				BACKGROUND_SATURATION,
				BACKGROUND_BRIGHTNESS
			);
			p.orbitControl(params.orbitControlSpeed, params.orbitControlSpeed);
			p.rotateX(params.rotationX);
			renderMesh(p, vRef.current, params);
		},
		[paramsRef]
	);

	return <P5Canvas className={className} draw={draw} setup={setup} />;
}

/**
 * Hook to create a ref for flower parameters
 */
export function useFlowerParams(
	initialParams: FlowerParams = defaultFlowerParams
) {
	const paramsRef = useRef<FlowerParams>(initialParams);
	return paramsRef;
}
