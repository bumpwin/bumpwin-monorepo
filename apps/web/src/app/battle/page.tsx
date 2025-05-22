import CommunicationPanel from "@/components/CommunicationPanel";
import InfoBar from "@/components/InfoBar";
import SwapUI from "@/components/SwapUI";
import type { RoundCoin } from "@/types/roundcoin";
import { mockmemes } from "@workspace/mockdata";
import { RoundsACard } from "./RoundsACard";

export default function RoundsAPage() {
  // Create a mock coin for the SwapUI
  const selectedCoin: RoundCoin = {
    id: "battle-coin",
    symbol: "YAKIU",
    name: "Yakiu",
    iconUrl: "/images/mockmemes/YAKIU.png",
    round: 12,
    share: 0,
    marketCap: 180000,
    description: "Battle coin",
  };

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex flex-1">
        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto pb-6 pt-4">
          <div className="max-w-7xl mx-auto">
            <InfoBar />

            {/* Battle section with swap UI */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="md:col-span-3">
                <h1 className="text-4xl font-extrabold text-white mb-6 text-center tracking-tight drop-shadow-lg">
                  Battle Round 12
                </h1>
                <div className="w-full h-64 bg-black/20 rounded-xl mb-4">
                  {/* Battle chart or visualization would go here */}
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Market Cap</div>
                    <div className="text-xl font-bold text-white">$180.09K</div>
                  </div>
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Volume</div>
                    <div className="text-xl font-bold text-white">$66K</div>
                  </div>
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Meme Count</div>
                    <div className="text-xl font-bold text-white">24</div>
                  </div>
                  <div className="bg-black/20 border border-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-400">Trader Count</div>
                    <div className="text-xl font-bold text-white">119</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center md:block">
                <SwapUI coin={selectedCoin} />
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-white my-6 text-center tracking-tight drop-shadow-lg">
              Rounds-A Gallery
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mockmemes.map((meme, i) => (
                <RoundsACard
                  key={meme.symbol}
                  imageUrl={meme.iconUrl}
                  symbol={meme.symbol}
                  name={meme.name}
                  percent={i % 2 === 0 ? "0.9%" : "13%"}
                  rank={i + 1}
                />
              ))}
            </div>
          </div>
        </main>
        {/* 右側チャット欄 */}
        <aside className="hidden lg:block">
          <CommunicationPanel />
        </aside>
      </div>
    </div>
  );
}
