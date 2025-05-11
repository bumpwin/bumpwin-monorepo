import { ChampionCoinList } from "@/components/ChampionCoinList";
import { CoinList } from "@/components/CoinList";
import CommunicationPanel from "@/components/CommunicationPanel";
import DominanceChart from "@/components/DominanceChart";
import { mockDominanceData } from "@/mock/mockDominanceData";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))]">
      {/* Main content area */}
      <main className="flex-1 overflow-y-auto pb-6">
        {/* Hero Banner Section - 画像に合わせたアスペクト比に変更 */}
        {/* <div className="w-full overflow-hidden relative aspect-[21/9] mb-4">
          <Image
            src="/hero.png"
            alt="BUMP.WIN - Meme Coin Battle Royale"
            fill
            className="object-cover object-center"
            priority
          />
        </div> */}

        {/* Dominance Chart Section */}
        <div className="px-4 mb-8">
          <h2 className="text-xl font-bold mb-4">Meme Coin Dominance</h2>
          <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-lg">
            <DominanceChart data={mockDominanceData} height={400} />
          </div>
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

      {/* Communication panel */}
      <aside className="hidden lg:block">
        <CommunicationPanel />
      </aside>
    </div>
  );
}
