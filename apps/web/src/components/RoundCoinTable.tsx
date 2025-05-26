import DominanceRechart from "@/components/DominanceRechart";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";
import { useBattleClock } from "@/providers/BattleClockProvider";
import type { CoinCardProps } from "@/types/coincard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/shadcn/components/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

interface RoundCoinTableProps {
  onSelectCoin?: (coin: CoinCardProps | undefined) => void;
  selectedCoinId?: string;
}

type SortType = "marketcap" | "tradedat";

export const RoundCoinTable: React.FC<RoundCoinTableProps> = ({
  onSelectCoin,
  selectedCoinId,
}) => {
  const { remainingTime, totalTime } = useBattleClock();
  const currentMinute = Math.floor((totalTime - remainingTime) / 60);
  const [sortType, setSortType] = useState<SortType>("marketcap");
  const [randomOrder, setRandomOrder] = useState<number[]>([]);

  // 3秒ごとにランダム順を更新
  useEffect(() => {
    if (sortType !== "tradedat") return;
    const interval = setInterval(() => {
      setRandomOrder(
        Array.from({ length: mockCoinMetadata.length }, (_, i) => i).sort(
          () => Math.random() - 0.5,
        ),
      );
    }, 3000);
    // 初回も即shuffle
    setRandomOrder(
      Array.from({ length: mockCoinMetadata.length }, (_, i) => i).sort(
        () => Math.random() - 0.5,
      ),
    );
    return () => clearInterval(interval);
  }, [sortType]);

  // 現在時刻のシェアを計算
  const currentShares: CoinCardProps[] = useMemo(() => {
    // 現在時刻に最も近いデータを取得
    const currentData = mockDominanceChartData.reduce((prev, curr) => {
      return Math.abs(curr.timestamp - currentMinute) <
        Math.abs(prev.timestamp - currentMinute)
        ? curr
        : prev;
    });

    if (!currentData) return [];

    const shares: CoinCardProps[] = mockCoinMetadata.map((coin, index) => ({
      address: coin.id.toString(),
      symbol: coin.symbol,
      name: coin.name,
      logoUrl: coin.icon,
      round: 1,
      share: currentData.shares?.[index] ?? 0,
      marketCap: Math.floor(Math.random() * 1000000),
      description: coin.description,
      isFavorite: false,
    }));

    if (sortType === "marketcap") {
      return shares.sort((a, b) => (b.share ?? 0) - (a.share ?? 0));
    }
    // tradedat: randomOrder順で並べる
    return randomOrder
      .map((i) => shares[i])
      .filter((c): c is CoinCardProps => !!c);
  }, [currentMinute, sortType, randomOrder]);

  const handleSelect = (coin: CoinCardProps) => {
    if (onSelectCoin) {
      if (selectedCoinId === coin.address) {
        onSelectCoin(undefined);
      } else {
        onSelectCoin(coin);
      }
    }
  };

  return (
    <div className="overflow-x-auto w-full m-0 p-0">
      <div className="flex justify-end mb-2 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="bg-[#181A20] text-white px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm focus:outline-none focus:ring-0 text-base"
            >
              {sortType === "marketcap" ? "Market Cap" : "Traded At"}
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#181A20] text-white">
            <DropdownMenuItem onClick={() => setSortType("marketcap")}>
              Market Cap
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortType("tradedat")}>
              Traded At
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <table className="min-w-full text-left border-separate border-spacing-y-2">
        <thead />
        <tbody>
          <AnimatePresence initial={false}>
            {currentShares.map(
              (coin) =>
                coin && [
                  <motion.tr
                    key={coin.address}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{
                      type: "tween",
                      duration: 0.18,
                      ease: "easeInOut",
                    }}
                    className={`bg-[#181A20] rounded-lg shadow-sm cursor-pointer transition border-2 ${selectedCoinId === coin.address ? "border-blue-500" : "border-transparent"}`}
                    style={{ borderColor: undefined }}
                    onClick={() => handleSelect(coin)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSelect(coin);
                      }
                    }}
                    tabIndex={0}
                  >
                    <td className="px-4 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-bold text-lg text-white">
                          <Image
                            src={coin.logoUrl}
                            alt={coin.name}
                            width={64}
                            height={64}
                            className="rounded-full w-16 h-16"
                          />
                          <div className="flex flex-col gap-1 ml-4">
                            <div className="flex items-center gap-2 font-bold text-lg text-white">
                              {coin.name}
                              <span className="text-xs text-gray-400 font-normal ml-1">
                                ({coin.symbol})
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-middle text-center">
                      <span className="text-2xl font-bold text-white">
                        {Math.round(coin.share ?? 0)}%
                      </span>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="bg-green-900/80 text-green-300 font-semibold rounded-lg px-4 py-2 hover:bg-green-800 transition"
                        >
                          Buy
                        </button>
                        <button
                          type="button"
                          className="bg-red-900/80 text-red-300 font-semibold rounded-lg px-4 py-2 hover:bg-red-800 transition"
                        >
                          Sell
                        </button>
                      </div>
                    </td>
                  </motion.tr>,
                  selectedCoinId && selectedCoinId === coin.address && (
                    <tr key={`${coin.address}-chart`}>
                      <td colSpan={3} className="p-0 bg-transparent">
                        <div
                          className="overflow-hidden transition-all duration-300 flex flex-row items-start gap-6"
                          style={{ maxHeight: 400 }}
                        >
                          <div className="min-w-[220px] max-w-[320px] flex flex-col gap-2 p-4">
                            <div className="text-white text-base font-semibold mb-2">
                              {coin.name} ({coin.symbol})
                            </div>
                            <div className="text-gray-300 text-sm mb-2">
                              {coin.description}
                            </div>
                          </div>
                          <div className="flex-1">
                            <DominanceRechart
                              points={mockDominanceChartData.map((data) => {
                                const idx = Number(coin.address);
                                const sharesArr = (data.shares ??
                                  []) as number[];
                                return {
                                  timestamp: data.timestamp,
                                  [coin.symbol]:
                                    sharesArr[
                                      typeof idx === "number" &&
                                      !Number.isNaN(idx)
                                        ? idx
                                        : 0
                                    ] ?? 0,
                                };
                              })}
                              coins={[
                                {
                                  symbol: coin.symbol,
                                  name: coin.name,
                                  color: "#FFD700",
                                },
                              ]}
                              height={220}
                              compact={true}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ),
                ],
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default RoundCoinTable;
