import React from "react";
import type { ChampionCoin } from "../types/champion";
import type { DominanceChartData } from "../types/dominance";
import DominanceChart from "./DominanceChart";
import Image from "next/image";

interface ChampionsListProps {
  coins: ChampionCoin[];
  dominanceData: DominanceChartData;
}

export const ChampionsList: React.FC<ChampionsListProps> = ({
  coins,
  dominanceData,
}) => {
  return (
    <ul className="flex flex-col gap-4">
      {coins.map((coin) => {
        return (
          <li
            key={coin.id}
            className="flex items-center bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg p-3 gap-4 border border-gray-800 hover:border-purple-500/50 transition-colors"
          >
            {/* 左: ラウンド情報 */}
            <div className="w-28 flex-shrink-0 text-center bg-gray-800/80 rounded-lg py-2 px-3 border border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Round</div>
              <div className="text-2xl font-bold text-orange-400">
                {coin.round}
              </div>
            </div>

            {/* 中央: アイコン・シンボル */}
            <div className="flex-1 flex items-center gap-4 min-w-0">
              <div className="relative h-16 w-16 flex-shrink-0">
                <Image
                  src={coin.iconUrl}
                  alt={coin.symbol}
                  fill
                  className="rounded-full border-2 border-purple-400 bg-white object-cover"
                />
              </div>
              <div className="min-w-0 overflow-hidden">
                <div className="text-3xl font-bold text-white truncate">
                  {coin.symbol}
                </div>
                <div className="text-sm text-gray-300 truncate">
                  {coin.name}
                </div>
              </div>
            </div>

            {/* 右: DominanceChart */}
            <div className="w-[320px] flex-shrink-0 flex items-center justify-end">
              <div className="w-full h-[160px]">
                <DominanceChart
                  data={dominanceData}
                  height={160}
                  showSingleCoinOnly={false}
                  coinId={coin.symbol.toLowerCase()}
                  className="!min-w-0"
                  volume=""
                  date=""
                  hideLegend={true}
                  compact={true}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
