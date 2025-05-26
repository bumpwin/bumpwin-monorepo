import DominanceRechart from "@/components/DominanceRechart";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";

interface StatsBarProps {
  compact?: boolean;
}

const StatsBar = ({ compact = false }: StatsBarProps) => {
  return (
    <div
      className={`w-full bg-black/30 backdrop-blur-md rounded-xl mb-6 ${
        compact ? "py-2" : "py-3"
      }`}
    >
      <div className="max-w-5xl mx-auto flex items-center gap-6 px-4">
        <span
          className={`text-white font-bold flex-shrink-0 ${
            compact ? "text-lg" : "text-2xl mr-4"
          }`}
        >
          Battle Round 7
        </span>
        <div className="flex flex-1 flex-row gap-4 justify-end">
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center flex-1">
            <span
              className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}
            >
              Market Cap
            </span>
            <span
              className={`text-white font-bold ${compact ? "text-lg" : "text-2xl"}`}
            >
              $180.09K
            </span>
          </div>
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center flex-1">
            <span
              className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}
            >
              Volume
            </span>
            <span
              className={`text-white font-bold ${compact ? "text-lg" : "text-2xl"}`}
            >
              $66K
            </span>
          </div>
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center flex-1">
            <span
              className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}
            >
              Meme Count
            </span>
            <span
              className={`text-white font-bold ${compact ? "text-lg" : "text-2xl"}`}
            >
              24
            </span>
          </div>
          <div className="bg-white/5 border border-gray-700 rounded-lg px-5 py-2 flex flex-col items-center flex-1">
            <span
              className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}
            >
              Trader Count
            </span>
            <span
              className={`text-white font-bold ${compact ? "text-lg" : "text-2xl"}`}
            >
              119
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DominanceChartSection = () => {
  // DominanceRechart用データ整形
  const chartPoints = mockDominanceChartData.map((point) => ({
    timestamp: point.timestamp,
    ...point.shares.reduce(
      (acc, share, index) =>
        Object.assign(acc, {
          [mockCoinMetadata[index]?.symbol.toLowerCase() || `coin${index}`]:
            share,
        }),
      {},
    ),
  }));
  const chartCoins = mockCoinMetadata.map((coin, index) => ({
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    color: `hsl(${(index * 360) / mockCoinMetadata.length}, 70%, 50%)`,
  }));

  return (
    <div className="w-full mt-4">
      <DominanceRechart
        points={chartPoints}
        coins={chartCoins}
        height={180}
        compact
        hideLegend
      />
    </div>
  );
};

const InfoBar = ({ compact = false }: StatsBarProps) => {
  return (
    <>
      <StatsBar compact={compact} />
      {!compact && <DominanceChartSection />}
    </>
  );
};

export default InfoBar;
