"use client";

import { ResultView } from "@/components/ResultView";
import { ChampionsList } from "@/components/champions/Champions";
import type { DominanceChartData, DominancePoint } from "@/types/dominance";
import type { UIRoundCoinData } from "@/types/ui-types";
import { getChampions, mockDominanceChartData } from "@workspace/mockdata";

export default function ChampionsPage() {
  const champions = getChampions();

  // Transform champions to ChampionCoin type
  const championCoins: UIRoundCoinData[] = champions.map((champion, index) => ({
    id: champion.meme?.id || (`0x${index.toString().padStart(40, "0")}` as const),
    round: champion.round.round,
    name: champion.meme?.name || "Unknown",
    symbol: champion.meme?.symbol || "UNKNOWN",
    iconUrl: champion.meme?.iconUrl || "/icon.png",
    description: champion.meme?.description || "Champion coin",
    price: 1.0, // Mock data
    marketCap: 1000000, // Mock data
  }));

  // Transform mockDominanceChartData to DominanceChartData type
  const dominanceData: DominanceChartData = {
    points: mockDominanceChartData.map((point) => {
      const dominancePoint: DominancePoint = {
        date: new Date(point.timestamp * 1000).toISOString(),
      };
      // Add each coin's share as a property
      point.shares.forEach((share, index) => {
        const coin = championCoins[index];
        if (coin) {
          dominancePoint[coin.symbol.toLowerCase()] = share / 100; // Convert percentage to decimal
        }
      });
      return dominancePoint;
    }),
    coins: championCoins.map((coin) => ({
      id: coin.id,
      name: coin.name,
      color: "#FFD700", // Mock color
    })),
  };

  return (
    <div className="relative flex min-h-[calc(100vh-var(--header-height))]">
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-6 p-4">
          {/* Title Section */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="flex items-center gap-2">
              <h1
                className="relative bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500 bg-clip-text font-extrabold text-4xl text-transparent drop-shadow-[0_2px_12px_rgba(255,255,180,0.35)] md:text-6xl"
                style={{
                  WebkitTextStroke: "1px #fff9",
                  letterSpacing: "0.02em",
                }}
              >
                CHAMPIONS <span className="align-middle" />
                <span
                  className="pointer-events-none absolute top-0 right-0 left-0 h-1/3 rounded-full bg-white/60 blur-md"
                  style={{ zIndex: 1 }}
                />
              </h1>
            </div>
            <div className="mt-4 text-center font-medium text-gray-300 text-xl drop-shadow-lg">
              The greatest coins of all time
            </div>
          </div>

          {/* Result View */}
          <div className="rounded-lg bg-white/5 p-4 shadow-lg backdrop-blur-sm">
            <ResultView
              coin={{
                id: champions[champions.length - 1]?.meme?.id || "0x0",
                round: champions[champions.length - 1]?.round.round || 4,
                symbol: champions[champions.length - 1]?.meme?.symbol || "JELL",
                name: champions[champions.length - 1]?.meme?.name || "JELL",
                iconUrl:
                  champions[champions.length - 1]?.meme?.iconUrl || "/images/mockmemes/JELL.png",
                description: champions[champions.length - 1]?.meme?.description || "Champion coin",
                share: 68,
                price: 1.0,
                marketCap: 100000,
              }}
              forceVisible={true}
            />
          </div>

          {/* Champions List */}
          <div className="rounded-lg bg-white/5 p-4 shadow-lg backdrop-blur-sm">
            <ChampionsList coins={championCoins} dominanceData={dominanceData} />
          </div>
        </div>
      </div>
    </div>
  );
}
