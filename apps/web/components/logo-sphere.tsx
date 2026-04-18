"use client";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

function RotatingSphere() {
	const texture = useTexture("/textures/texture6.jpg");
	const ref = useRef<Mesh>(null);

	useFrame((_, delta) => {
		if (ref.current) {
			ref.current.rotation.y += delta * 0.4;
		}
	});

	return (
		<mesh ref={ref}>
			<sphereGeometry args={[1, 32, 32]} />
			<meshStandardMaterial color="#88ffaa" map={texture} />
		</mesh>
	);
}

export function LogoSphere() {
	return (
		<div className="size-9">
			<Canvas camera={{ position: [0, 0, 2.5] }} gl={{ alpha: true }}>
				<ambientLight intensity={0.9} />
				<directionalLight intensity={1.2} position={[3, 3, 3]} />
				<RotatingSphere />
			</Canvas>
		</div>
	);
}
