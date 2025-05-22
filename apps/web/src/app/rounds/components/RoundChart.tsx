import DominanceRechart from "@/components/DominanceRechart";
import React from "react";
import type { ChartCoin, ChartPoint } from "../types";

interface RoundChartProps {
  points: ChartPoint[];
  coins: ChartCoin[];
}

export function RoundChart({ points, coins }: RoundChartProps) {
  return (
    <div className="bg-black/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-3 mb-2">
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
