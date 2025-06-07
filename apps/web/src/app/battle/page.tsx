"use client";

import { RoundsACard } from "@/app/battle/RoundsACard";
import { api } from "@/app/client";
import type { CoinMetadata } from "@/app/rounds/types";
import BattleCoinDetailCard from "@/components/battle/BattleCoinDetailCard";
import { BattleRoundPhaseToggle } from "@/components/battle/BattleRoundPhaseToggle";
import { ChartTitle } from "@/components/charts/ChartTitle";
import { MarketDominanceCard } from "@/components/charts/MarketDominanceCard";
import { LWCChart, type OHLCData } from "@/components/charts/chart/lwc-chart";
import SharrowStatsBar from "@/components/stats/SharrowStatsBar";
import DarknightSwapUI from "@/components/trading/swap/variants/DarknightSwapUI";
import DaytimeSwapUI from "@/components/trading/swap/variants/DaytimeSwapUI";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCoinMetadata } from "@/hooks";
import { useBattleClock } from "@/providers/BattleClockProvider";
import type { UIRoundCoinData } from "@/types/ui-types";
import { useQuery } from "@tanstack/react-query";
import type { MemeMetadata } from "@workspace/types";

// API Response types
interface BattleApiResponse {
  memes?: Array<{ metadata?: MemeMetadata }>;
}
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

// Constants
const DEFAULT_COIN: UIRoundCoinData = {
  id: "0x0000000000000000000000000000000000000000000000000000000000000001",
  symbol: "LAG",
  name: "Lag Girl",
  iconUrl: "/images/mockmemes/LAG.jpg",
  round: 12,
  share: 0,
  price: 0.1,
  marketCap: 180000,
  description: "lagging since 2020",
};

const PERCENTAGE = {
  LAG: "0.9%",
  DEFAULT: "13%",
} as const;

const PRICE_MULTIPLIER = {
  LAG: 1.009,
  DEFAULT: 1.13,
} as const;

// Types
type PriceDataItem = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

// Utility functions
const memeToRoundCoin = (meme: MemeMetadata): UIRoundCoinData => ({
  id: meme.id,
  symbol: meme.symbol,
  name: meme.name,
  iconUrl: meme.iconUrl,
  round: 12,
  share: 0,
  price: 0.1,
  marketCap: 180000,
  description: meme.description,
});

const formatPriceData = (data: PriceDataItem[]) => {
  return data.map((item) => {
    const date = new Date(item.timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return {
      time: `${year}-${month}-${day}`,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    };
  });
};

// Layout Components
const ScrollableContainer = ({ children, className = "" }: LayoutProps) => (
  <div className={`h-full overflow-y-auto ${className}`}>{children}</div>
);

const FixedContainer = ({ children, className = "" }: LayoutProps) => (
  <div className={`flex-shrink-0 ${className}`}>{children}</div>
);

// Feature Components
const PriceChart = ({
  coin,
  priceData,
  isLoading,
}: {
  coin: UIRoundCoinData;
  priceData: OHLCData[] | undefined;
  isLoading: boolean;
}) => {
  const currentPrice =
    priceData && priceData.length > 0 ? (priceData[priceData.length - 1]?.close ?? 0) : 0;
  const percentage = coin.symbol === "LAG" ? PERCENTAGE.LAG : PERCENTAGE.DEFAULT;
  const priceMultiplier = coin.symbol === "LAG" ? PRICE_MULTIPLIER.LAG : PRICE_MULTIPLIER.DEFAULT;

  return (
    <Card className="mb-4 w-full border-none bg-black/20 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <ChartTitle coin={coin} percentage={percentage} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-blue-500 border-t-4 border-b-4" />
          </div>
        ) : (
          <LWCChart
            data={priceData || []}
            currentPrice={currentPrice}
            height={200}
            className="mt-3"
            priceLines={[
              {
                price: currentPrice * priceMultiplier,
                color: "#22c55e",
                lineWidth: 1,
                lineStyle: 2,
                axisLabelVisible: true,
                title: percentage,
              },
            ]}
          />
        )}
      </CardContent>
    </Card>
  );
};

const MemeGallery = ({
  memes,
  onSelect,
  selectedSymbol,
}: {
  memes: MemeMetadata[];
  onSelect: (meme: MemeMetadata) => void;
  selectedSymbol: string;
}) => (
  <div className="px-4 pb-6">
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {memes.map((meme, i) => (
        <button
          key={meme.symbol}
          onClick={() => onSelect(meme)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSelect(meme);
          }}
          tabIndex={0}
          className="w-[200px] cursor-pointer rounded-xl border-none bg-transparent p-0 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-pressed={selectedSymbol === meme.symbol}
          type="button"
        >
          <RoundsACard
            imageUrl={meme.iconUrl}
            symbol={meme.symbol}
            name={meme.name}
            percent={i % 2 === 0 ? PERCENTAGE.LAG : PERCENTAGE.DEFAULT}
            rank={i + 1}
          />
        </button>
      ))}
    </div>
  </div>
);

export default function RoundsAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("selected");
  const { phase, remainingTime } = useBattleClock();

  // Fetch current battle data
  const { data: battleData, isLoading: isBattleLoading } = useQuery({
    queryKey: ["battle", "current"],
    queryFn: async () => {
      const res = await api.battlerounds.current.$get();
      const json = await res.json();

      if ("error" in json) {
        throw new Error(json.error as string);
      }

      return json;
    },
  });

  // Use API-based coin data for consistent 8 coins in darknight mode
  const { data: darknightCoins = [] } = useCoinMetadata({
    darknight: true,
    limit: 8,
  });

  const typedBattleData = battleData as BattleApiResponse | undefined;
  const allMemes: MemeMetadata[] =
    typedBattleData?.memes
      ?.filter((m): m is { metadata: MemeMetadata } => !!m.metadata)
      .map((m) => m.metadata) || [];

  // Convert CoinMetadata to MemeMetadata format for compatibility
  const darknightMemes: MemeMetadata[] = darknightCoins.map((coin: CoinMetadata) => ({
    id: `0x${coin.id.toString().padStart(64, "0")}` as `0x${string}`,
    name: coin.name,
    symbol: coin.symbol,
    description: coin.description,
    iconUrl: coin.icon,
  }));

  // Use API-based selection for darknight, otherwise show all memes
  const memes = phase === "darknight" ? darknightMemes : allMemes;
  const firstMeme = memes.length > 0 ? memes[0] : null;
  const selectedMeme = selectedId
    ? memes.find((m: MemeMetadata) => m.symbol === selectedId) || firstMeme
    : firstMeme;

  const [selectedCoin, setSelectedCoin] = useState<UIRoundCoinData>(
    selectedMeme ? memeToRoundCoin(selectedMeme) : DEFAULT_COIN,
  );

  const handleCoinSelect = (meme: MemeMetadata) => {
    const newCoin = memeToRoundCoin(meme);
    setSelectedCoin(newCoin);
    router.push(`?selected=${meme.symbol}`);
  };

  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["mockprice", selectedCoin.id],
    queryFn: async () => {
      const res = await api.mockprice.$get({
        query: { seed: selectedCoin.id, freq: "day", count: "30" },
      });
      const json = await res.json();

      if ("error" in json) {
        throw new Error(json.error as string);
      }

      return formatPriceData(json.data);
    },
  });

  if (isBattleLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-blue-500 border-t-4 border-b-4" />
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <main className="h-full flex-1 overflow-hidden">
        {!selectedId ? (
          <ScrollableContainer>
            <div className="sticky top-0 z-20 bg-[#181B27]/95">
              <SharrowStatsBar />
            </div>

            <div className="px-4">
              <MarketDominanceCard remainingTime={remainingTime} />
            </div>

            <MemeGallery
              memes={memes}
              onSelect={handleCoinSelect}
              selectedSymbol={selectedCoin.symbol}
            />
          </ScrollableContainer>
        ) : (
          <div className="flex h-full flex-col overflow-hidden">
            <FixedContainer>
              <div className="sticky top-0 z-20 bg-[#181B27]/95">
                <SharrowStatsBar />
              </div>

              <div className="px-4">
                <PriceChart coin={selectedCoin} priceData={priceData} isLoading={isPriceLoading} />
              </div>
            </FixedContainer>

            <ScrollableContainer className="flex-1">
              <MemeGallery
                memes={memes}
                onSelect={handleCoinSelect}
                selectedSymbol={selectedCoin.symbol}
              />
            </ScrollableContainer>
          </div>
        )}
      </main>

      <aside className="h-full w-[400px] flex-shrink-0 overflow-hidden">
        <ScrollableContainer>
          <div className="p-4">
            <div className="flex flex-col items-center gap-2">
              <BattleRoundPhaseToggle />
              {phase === "daytime" ? (
                <DaytimeSwapUI coin={selectedCoin} />
              ) : (
                <DarknightSwapUI coin={selectedCoin} />
              )}
            </div>
            <BattleCoinDetailCard coin={selectedCoin} />
          </div>
        </ScrollableContainer>
      </aside>
    </div>
  );
}
