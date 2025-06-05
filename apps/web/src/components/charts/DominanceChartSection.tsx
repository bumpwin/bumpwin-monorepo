import DominanceRechart from "@/components/charts/DominanceRechart";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";

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

export default DominanceChartSection;
