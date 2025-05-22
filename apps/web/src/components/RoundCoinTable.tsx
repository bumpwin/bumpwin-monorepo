import { useBattleClock } from "@/app/providers/BattleClockProvider";
import DominanceRechart from "@/components/DominanceRechart";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";
import type { RoundCoin } from "@/types/roundcoin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/shadcn/components/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Globe, Send, Twitter } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useMemo, useState } from "react";

interface RoundCoinTableProps {
  onSelectCoin?: (coin: RoundCoin | undefined) => void;
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
  const currentShares = useMemo(() => {
    // 現在時刻に最も近いデータを取得
    const currentData = mockDominanceChartData.reduce((prev, curr) => {
      return Math.abs(curr.timestamp - currentMinute) <
        Math.abs(prev.timestamp - currentMinute)
        ? curr
        : prev;
    });

    if (!currentData) return [];

    const shares = mockCoinMetadata.map((coin, index) => ({
      id: coin.id.toString(),
      symbol: coin.symbol,
      name: coin.name,
      iconUrl: coin.icon,
      round: 1,
      share: currentData.shares?.[index] ?? 0,
      marketCap: Math.floor(Math.random() * 1000000),
      description: coin.description,
      telegramLink: coin.telegramLink,
      websiteLink: coin.websiteLink,
      twitterLink: coin.twitterLink,
      color: coin.color,
    }));

    if (sortType === "marketcap") {
      return shares.sort((a, b) => b.share - a.share);
    }
    // tradedat: randomOrder順で並べる
    return randomOrder.map((i) => shares[i]).filter(Boolean);
  }, [currentMinute, sortType, randomOrder]);

  const handleSelect = (coin: RoundCoin) => {
    if (onSelectCoin) {
      if (selectedCoinId === coin.id) {
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
                    key={coin.id}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{
                      type: "tween",
                      duration: 0.18,
                      ease: "easeInOut",
                    }}
                    className={`bg-[#181A20] rounded-lg shadow-sm cursor-pointer transition border-2 ${selectedCoinId === coin.id ? "border-blue-500" : "border-transparent"}`}
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
                            src={coin.iconUrl}
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
                        {Math.round(coin.share)}%
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
                  selectedCoinId && selectedCoinId === coin.id && (
                    <tr key={`${coin.id}-chart`}>
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
                            <div className="flex gap-3 mt-2">
                              {coin.telegramLink && (
                                <a
                                  href={coin.telegramLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Telegram"
                                  className="text-gray-400"
                                >
                                  <Send className="w-[18px] h-[18px]" />
                                </a>
                              )}
                              {coin.websiteLink && (
                                <a
                                  href={coin.websiteLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Website"
                                  className="text-gray-400"
                                >
                                  <Globe className="w-[18px] h-[18px]" />
                                </a>
                              )}
                              {coin.twitterLink && (
                                <a
                                  href={coin.twitterLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Twitter"
                                  className="text-gray-400"
                                >
                                  <Twitter className="w-[18px] h-[18px]" />
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <DominanceRechart
                              points={mockDominanceChartData.map((data) => ({
                                timestamp: data.timestamp,
                                [coin.symbol]:
                                  data.shares?.[Number(coin.id)] ?? 0,
                              }))}
                              coins={[
                                {
                                  symbol: coin.symbol,
                                  name: coin.name,
                                  color: coin.color,
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
