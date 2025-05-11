import { ChampionCoinList } from "@/components/ChampionCoinList";
import { CoinList } from "@/components/CoinList";
import CommunicationPanel from "@/components/CommunicationPanel";
import DominanceChart from "@/components/DominanceChart";
import { mockDominanceData } from "@/mock/mockDominanceData";
import InfoBar from "@/components/InfoBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col">
      {/* <InfoBar /> */}
      <div className="flex flex-1">
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto pb-6">
          {/* Hero Banner Section - さらに横長のアスペクト比に変更 */}
          <div className="w-full overflow-hidden relative aspect-[48/7] mb-4">
            <Image
              src="/hero.png"
              alt="BUMP.WIN - Meme Coin Battle Royale"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Dominance Chart Section */}
          <div className="px-4 mb-8">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <DominanceChart
                data={mockDominanceData}
                height={320}
                volume="$6,396,866 Vol."
                date="Jun 18, 2025"
              />
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
    </div>
  );
}
