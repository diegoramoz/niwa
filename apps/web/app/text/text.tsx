"use client";

import { Center, Environment, Text3D } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

const FONT = "/fonts/Cinzel-Bold.json";
const TEXT_OPTS = {
	size: 0.8,
	depth: 0.2,
	curveSegments: 12,
	bevelEnabled: true,
	bevelThickness: 0.02,
	bevelSize: 0.01,
	bevelSegments: 3,
} as const;

function NameText() {
	const groupRef = useRef<Group>(null);

	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.rotation.y += 0.005;
		}
	});

	return (
		<group ref={groupRef}>
			<group position={[0, 0.45, 0]}>
				<Center>
					<Text3D font={FONT} {...TEXT_OPTS}>
						DIEGO
						<meshStandardMaterial
							color="#d0d0d0"
							metalness={0.9}
							roughness={0.15}
						/>
					</Text3D>
				</Center>
			</group>
			<group position={[0, -0.45, 0]}>
				<Center>
					<Text3D font={FONT} {...TEXT_OPTS}>
						RAMOS
						<meshStandardMaterial
							color="#d0d0d0"
							metalness={0.9}
							roughness={0.15}
						/>
					</Text3D>
				</Center>
			</group>
		</group>
	);
}

export function Text() {
	return (
		<div className="h-screen w-full">
			<Canvas camera={{ position: [0, 0, 6] }}>
				<ambientLight intensity={0.4} />
				<directionalLight color="#fff8e7" intensity={2} position={[5, 3, 5]} />
				<directionalLight
					color="#a8c8ff"
					intensity={1}
					position={[-5, -2, -3]}
				/>
				<Environment preset="city" />
				<NameText />
			</Canvas>
		</div>
	);
}
