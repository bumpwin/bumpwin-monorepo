import DominanceRechart from "@/components/DominanceRechart";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";

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

export default DominanceChartSection;
