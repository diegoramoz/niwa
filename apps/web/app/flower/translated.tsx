// Translated from Kazuki Umeda's original p5.js sketch
// https://www.youtube.com/watch?v=8fgJ6i96fTY

"use client";

import { P5Canvas } from "components/p5";
import type p5 from "p5";

// Canvas and rendering constants
const STROKE_WEIGHT = 0;
// const BACKGROUND_HUE = 0;
// const BACKGROUND_SATURATION = 0;
// const BACKGROUND_BRIGHTNESS = 0;
const ORBIT_CONTROL_SPEED = 4;
const ROTATION_X_ANGLE = 60;

// Mesh resolution
const ROWS = 60;
const COLS = 120;
const THETA_STEP = 1;
const PHI_STEP = 1;

// Flower shape parameters
const PETAL_COUNT = 5;
const FLOWER_DIAMETER = 200;
const PETAL_LENGTH = 60;
const PETAL_SHARPNESS = 0.4;

// Vertical shape parameters
const FLOWER_HEIGHT = 300;
const CURVATURE_EXPONENTIAL = 0.8;
const CURVATURE_POLYNOMIAL = 0.2;
const CURVATURE_POWER = 1.5;
const VERTICAL_SHIFT = 200;

// Bumpiness parameters
const BUMP_AMPLITUDE = 2.5;
const BUMP_FREQUENCY = 10;

// Color parameters
const FILL_HUE = 340;
const FILL_SATURATION_BASE = 100;
const FILL_BRIGHTNESS = 100;

let v: p5.Vector[][] = [];

function setup(p: p5, height: number, width: number) {
	p.createCanvas(width, height, p.WEBGL);
	p.angleMode(p.DEGREES);
	p.colorMode(p.HSB, 360, 100, 100);
	p.noStroke();
	if (STROKE_WEIGHT > 0) {
		p.stroke(0);
		p.strokeWeight(STROKE_WEIGHT);
	}
}

/**
 * Calculates the vertical shape of the flower using exponential and polynomial terms
 * Formula: A * e^(-b * |r|^c) * |r|^a
 */
function calculateVerticalShape(
	p: p5,
	amplitude: number,
	normalizedRadius: number,
	polynomialExponent: number,
	exponentialCoefficient: number,
	radiusPower: number
): number {
	const exponentialTerm = p.pow(
		Math.E,
		-exponentialCoefficient * p.pow(p.abs(normalizedRadius), radiusPower)
	);
	const polynomialTerm = p.pow(p.abs(normalizedRadius), polynomialExponent);
	return amplitude * exponentialTerm * polynomialTerm;
}

/**
 * Adds wave-like bumps to the flower surface
 * Formula: 1 + A * r^2 * sin(f * angle)
 */
function calculateBumpiness(
	p: p5,
	amplitude: number,
	normalizedRadius: number,
	frequency: number,
	angle: number
): number {
	return 1 + amplitude * p.pow(normalizedRadius, 2) * p.sin(frequency * angle);
}

function drawQuad(
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
		drawQuad(p, cur, nextTheta, nextBoth, nextPhi);
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
		drawQuad(p, cur, firstPhi, nextThetaFirst, nextThetaCur);
	}
}

function renderThetaRow(
	p: p5,
	mesh: p5.Vector[][],
	theta: number,
	thetaRow: p5.Vector[]
) {
	const saturation = FILL_SATURATION_BASE - theta;
	p.fill(FILL_HUE, saturation, FILL_BRIGHTNESS);
	const nextThetaRow = mesh[theta + 1];
	const isNotLastTheta = theta < mesh.length - 1;
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

function renderMesh(p: p5, mesh: p5.Vector[][]) {
	for (let theta = 0; theta < mesh.length; theta++) {
		const thetaRow = mesh[theta];
		if (!thetaRow) {
			continue;
		}
		renderThetaRow(p, mesh, theta, thetaRow);
	}
}

function draw(p: p5) {
	p.clear();
	p.orbitControl(ORBIT_CONTROL_SPEED, ORBIT_CONTROL_SPEED);
	p.rotateX(ROTATION_X_ANGLE);

	// Generate theta values for rows
	const thetaValues = Array.from(
		{ length: Math.ceil(ROWS / THETA_STEP) },
		(_, i) => i * THETA_STEP
	);

	// Build vertex mesh
	for (const theta of thetaValues) {
		v.push([]);

		// Generate phi values for columns
		const phiValues = Array.from(
			{ length: Math.ceil(COLS / PHI_STEP) },
			(_, i) => i * PHI_STEP
		);

		for (const phi of phiValues) {
			// Calculate radial distance with petal shape
			const petalShape = p.pow(
				p.abs(p.sin(((PETAL_COUNT / 2) * phi * 360) / COLS)),
				PETAL_SHARPNESS
			);
			const r = ((PETAL_LENGTH * petalShape + FLOWER_DIAMETER) * theta) / ROWS;

			// Convert to Cartesian coordinates
			const x = r * p.cos((phi * 360) / COLS);
			const y = r * p.sin((phi * 360) / COLS);

			// Calculate normalized radius for z-coordinate functions
			const normalizedR = p.abs(r / 100);

			// Calculate vertical position with curvature
			const verticalShape = calculateVerticalShape(
				p,
				FLOWER_HEIGHT,
				normalizedR,
				CURVATURE_POLYNOMIAL,
				CURVATURE_EXPONENTIAL,
				CURVATURE_POWER
			);

			// Add surface bumpiness
			const bumpiness = calculateBumpiness(
				p,
				BUMP_AMPLITUDE,
				normalizedR,
				BUMP_FREQUENCY,
				(phi * 360) / COLS
			);

			const z = verticalShape - VERTICAL_SHIFT + bumpiness;

			const vPoint = p.createVector(x, y, z);
			v[theta]?.push(vPoint);
		}
	}

	// Render mesh as quadrilaterals
	renderMesh(p, v);

	v = []; // Clear vertex array to save memory
}

export function FlowerTranslated() {
	return <P5Canvas draw={draw} setup={setup} />;
}
