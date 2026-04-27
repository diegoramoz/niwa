import { BottomNav } from "@/components/wireframe/bottom-nav";
import { Sidebar } from "@/components/wireframe/sidebar";

export default function Page() {
	return (
		<div className="bg-(image:--crossed-gradient) absolute inset-y-0 flex flex-col items-center justify-center">
			<Sidebar />
			<BottomNav />
			<div className="border-2 border-foreground bg-background px-2 font-bold">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic eos
				ratione dolor illo quam aspernatur et exercitationem aut excepturi minus
				laborum tempora itaque dolni et numquam, necessitatibus minus assumenda
				sint atque inventore ipsa a esse dolor error sed praesentium quos,
				molestiae cumque s
			</div>
		</div>
	);
}
