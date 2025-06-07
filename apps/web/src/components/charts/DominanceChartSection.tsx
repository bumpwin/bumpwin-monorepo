import DominanceRechart from "@/components/charts/DominanceRechart";
import { useCoinMetadata, useDominanceData } from "@/hooks";
import { useBattleClock } from "@/providers/BattleClockProvider";
import { getColorByIndex } from "@/utils/colors";
import { useMemo } from "react";

const DominanceChartSection = () => {
  const { phase } = useBattleClock();

  // APIからデータを取得 - darknightモードでは8つに制限
  const { data: coinMetadata = [], isLoading: isLoadingCoins } = useCoinMetadata({
    darknight: phase === "darknight",
    limit: phase === "darknight" ? 8 : undefined,
  });
  const { data: dominanceData = [], isLoading: isLoadingDominance } = useDominanceData();

  // DominanceRechart用データ整形
  const chartPoints = useMemo(() => {
    if (!coinMetadata.length || !dominanceData.length) return [];

    return dominanceData.map((point) => ({
      timestamp: point.timestamp,
      ...point.shares.reduce(
        (acc, share, index) =>
          Object.assign(acc, {
            [coinMetadata[index]?.symbol.toLowerCase() || `coin${index}`]: share,
          }),
        {},
      ),
    }));
  }, [coinMetadata, dominanceData]);

  const chartCoins = useMemo(() => {
    if (!coinMetadata.length) return [];

    return coinMetadata.map((coin, index) => ({
      symbol: coin.symbol.toLowerCase(),
      name: coin.name,
      color: getColorByIndex(index),
    }));
  }, [coinMetadata]);

  // ローディング状態の処理
  if (isLoadingCoins || isLoadingDominance) {
    return (
      <div className="mt-4 w-full">
        <div className="flex items-center justify-center py-8">
          <div className="text-white">Loading chart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full">
      <DominanceRechart points={chartPoints} coins={chartCoins} height={180} compact hideLegend />
    </div>
  );
};

export default DominanceChartSection;
