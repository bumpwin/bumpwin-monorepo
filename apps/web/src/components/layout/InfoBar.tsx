import DominanceRechart from "@/components/charts/DominanceRechart";
import { mockCoinMetadata, mockDominanceChartData } from "@/lib/tempMockData";

interface StatsBarProps {
  compact?: boolean;
}

const StatsBar = ({ compact = false }: StatsBarProps) => {
  return (
    <div
      className={`mb-6 w-full rounded-xl bg-black/30 backdrop-blur-md ${compact ? "py-2" : "py-3"}`}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4">
        <span
          className={`flex-shrink-0 font-bold text-white ${compact ? "text-lg" : "mr-4 text-2xl"}`}
        >
          Battle Round 7
        </span>
        <div className="flex flex-1 flex-row justify-end gap-4">
          <div className="flex flex-1 flex-col items-center rounded-lg border border-gray-700 bg-white/5 px-5 py-2">
            <span className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}>Market Cap</span>
            <span className={`font-bold text-white ${compact ? "text-lg" : "text-2xl"}`}>
              $180.09K
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center rounded-lg border border-gray-700 bg-white/5 px-5 py-2">
            <span className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}>Volume</span>
            <span className={`font-bold text-white ${compact ? "text-lg" : "text-2xl"}`}>$66K</span>
          </div>
          <div className="flex flex-1 flex-col items-center rounded-lg border border-gray-700 bg-white/5 px-5 py-2">
            <span className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}>Meme Count</span>
            <span className={`font-bold text-white ${compact ? "text-lg" : "text-2xl"}`}>24</span>
          </div>
          <div className="flex flex-1 flex-col items-center rounded-lg border border-gray-700 bg-white/5 px-5 py-2">
            <span className={`text-gray-400 ${compact ? "text-sm" : "text-lg"}`}>Trader Count</span>
            <span className={`font-bold text-white ${compact ? "text-lg" : "text-2xl"}`}>119</span>
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
          [mockCoinMetadata[index]?.symbol.toLowerCase() || `coin${index}`]: share,
        }),
      {},
    ),
  }));
  const chartCoins = mockCoinMetadata.map((coin) => ({
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    color: coin.color,
  }));

  return (
    <div className="mt-4 w-full">
      <DominanceRechart points={chartPoints} coins={chartCoins} height={180} compact hideLegend />
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
