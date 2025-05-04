import { ChampionCoinList } from "@/components/ChampionCoinList";
import ChatPanel from "@/components/ChatPanel";
import { CoinList } from "@/components/CoinList";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex min-h-[calc(100vh-var(--header-height))]">
			{/* Main content area */}
			<main className="flex-1 overflow-y-auto pb-6">
				{/* Hero Banner Section - 画像に合わせたアスペクト比に変更 */}
				<div className="w-full overflow-hidden relative aspect-[21/9] mb-4">
					<Image
						src="/hero.png"
						alt="BUMP.WIN - Meme Coin Battle Royale"
						fill
						className="object-cover object-center"
						priority
					/>
				</div>

				{/* Previous Champions Section */}
				<div className="mb-6">
					<ChampionCoinList />
				</div>

				{/* Current Round Contestants */}
				<div id="current-round">
					<CoinList />
				</div>
			</main>

			{/* Chat panel */}
			<aside className="hidden lg:block">
				<ChatPanel />
			</aside>
		</div>
	);
}
