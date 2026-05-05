"use client";

import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { MeshStandardMaterial } from "three";

function ZCardMesh() {
	const texture = useTexture("/textures/texture3.jpg");

	// Create materials array: front face gets the texture, others get solid color
	const materials = useMemo(() => {
		return [
			new MeshStandardMaterial({ color: "#00d9ff" }), // right
			new MeshStandardMaterial({ color: "#00d9ff" }), // left
			new MeshStandardMaterial({ color: "#00d9ff" }), // top
			new MeshStandardMaterial({ color: "#00d9ff" }), // bottom
			new MeshStandardMaterial({ map: texture }), // front - with texture
			new MeshStandardMaterial({ color: "#00d9ff" }), // back
		];
	}, [texture]);

	return (
		<mesh material={materials}>
			<boxGeometry args={[2.7, 4.28, 0.1]} />
		</mesh>
	);
}

export function Z3Card() {
	return (
		<div className="aspect-540/856 w-100">
			<Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
				<ambientLight intensity={0.6} />
				<directionalLight castShadow intensity={1.5} position={[3, 3, 8]} />
				<directionalLight intensity={0.8} position={[-2, -2, 5]} />
				<OrbitControls enableZoom={true} />
				<ZCardMesh />
			</Canvas>
		</div>
	);
}
