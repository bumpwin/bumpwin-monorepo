import type { ChartCoin, ChartPoint } from "@/app/rounds/types";
import DominanceRechart from "@/components/charts/DominanceRechart";

interface RoundChartProps {
  points: ChartPoint[];
  coins: ChartCoin[];
}

export function RoundChart({ points, coins }: RoundChartProps) {
  return (
    <div className="mb-2 rounded-xl border border-gray-700/50 bg-black/50 p-3 backdrop-blur-sm">
      <DominanceRechart
        points={points}
        coins={coins}
        height={180}
        compact={false}
        hideLegend={false}
        showAllTime={true}
      />
    </div>
  );
}
