import { ChampionCoinList } from "@/components/ChampionCoinList";
import ChatPanel from "@/components/ChatPanel";
import { CoinList } from "@/components/CoinList";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex min-h-[calc(100vh-var(--header-height))]">
			{/* Main content area */}
			<main className="flex-1 overflow-y-auto pb-6 pt-8">
				{/* Hero Banner Section - 6:1 aspect ratio */}
				<div className="w-full overflow-hidden mb-6 relative aspect-[6/1]">
					<Image
						src="/hero.png"
						alt="BUMP.WIN - Meme Coin Battle Royale"
						fill
						className="object-cover object-center"
						priority
					/>
				</div>

				<ChampionCoinList />
				<CoinList />
			</main>

			{/* Chat panel */}
			<aside className="hidden lg:block">
				<ChatPanel />
			</aside>
		</div>
	);
}
