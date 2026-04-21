import { Space_Mono } from "next/font/google";
import { Dither } from "@/app/dither/dither";

const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["700"] });

export default function Page() {
	return (
		<div className="relative h-screen w-full">
			<Dither
				colorNum={4}
				disableAnimation={false}
				enableMouseInteraction={true}
				mouseRadius={0.3}
				waveAmplitude={0.3}
				waveColor={[0.5, 0.3, 0.3]}
				waveFrequency={3}
				waveSpeed={0.05}
			/>
			<div
				className={`${spaceMono.className} absolute inset-0 z-30 flex select-none items-center justify-center px-4 font-bold text-4xl text-white leading-relaxed lg:text-9xl`}
			>
				Diego Ramos
			</div>
		</div>
	);
}
