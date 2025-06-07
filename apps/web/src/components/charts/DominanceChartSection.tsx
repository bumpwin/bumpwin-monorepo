import DominanceRechart from "@/components/charts/DominanceRechart";
import { getColorByIndex } from "@/utils/colors";
import { mockCoinMetadata, mockDominanceChartData } from "@workspace/mockdata";

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
  const chartCoins = mockCoinMetadata.map((coin, index) => ({
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    color: getColorByIndex(index),
  }));

  return (
    <div className="mt-4 w-full">
      <DominanceRechart points={chartPoints} coins={chartCoins} height={180} compact hideLegend />
    </div>
  );
};

export default DominanceChartSection;
