import { BottomNav } from "@/components/wireframe/bottom-nav";
import { Sidebar } from "@/components/wireframe/sidebar";
import { TopNav } from "@/components/wireframe/top-nav";

export default function Page() {
	return (
		<div className="bg-(image:--crossed-gradient)">
			<TopNav hideOn="mobile" />
			<BottomNav hideOn="desktop" />
			<Sidebar />
			<div className="border-2 border-foreground bg-background px-2 font-bold">
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic eos
				ratione dolor illo quam aspernatur et exercitationem aut excepturi minus
				laborum tempora itaque dolni et numquam, necessitatibus minus assumenda
				sint atque inventore ipsa a esse dolor error sed praesentium quos,
				molestiae cumque sequi nemo pariatur earum quo! Fuga, consequuntur!
				Architecto veritatis pariatur recusandae, id suscipit consequatur
				itaque, voluptates non reiciendis provident laudantium repellendus dolor
				quas commodi! Accusamus sequi delectus cum quisquam cumque quis nulla
				reprehenderit iusto cupiditate! Quisquam, laboriosam earum iste
				consequuntur sint adipisci sapiente quae ratione itaque molestias cumque
				officia? Aliquid doloribus doloremque exercitationem cum sed! Iure
				accusamus hic eveniet dolores culpa, doloribus rerum minus dolore
				debitis cumque nostrum inventore laboriosam voluptate minima sint maxime
				repellat.
			</div>
		</div>
	);
}
