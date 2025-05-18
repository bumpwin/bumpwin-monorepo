import DominanceRechart from "@/components/DominanceRechart";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";
import { useBattleClock } from "@/app/providers/BattleClockProvider";
import type { RoundCoin } from "@/types/roundcoin";
import Image from "next/image";
import type React from "react";
import { useMemo, useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@workspace/shadcn/components/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";

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
        Array.from({ length: mockCoinMetadata.length }, (_, i) => i)
          .sort(() => Math.random() - 0.5)
      );
    }, 3000);
    // 初回も即shuffle
    setRandomOrder(
      Array.from({ length: mockCoinMetadata.length }, (_, i) => i)
        .sort(() => Math.random() - 0.5)
    );
    return () => clearInterval(interval);
  }, [sortType]);

  // 現在時刻のシェアを計算
  const currentShares = useMemo(() => {
    // 現在時刻に最も近いデータを取得
    const currentData = mockDominanceChartData.reduce((prev, curr) => {
      return Math.abs(curr.timestamp - currentMinute) < Math.abs(prev.timestamp - currentMinute) ? curr : prev;
    });

    if (!currentData) return [];

    const shares = mockCoinMetadata
      .map((coin, index) => ({
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
    } else {
      // tradedat: randomOrder順で並べる
      return randomOrder.map(i => shares[i]).filter(Boolean);
    }
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
            <button className="bg-[#181A20] text-white px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm focus:outline-none focus:ring-0 text-base">
              {sortType === "marketcap" ? "Market Cap" : "Traded At"}
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M6 8L10 12L14 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#181A20] text-white">
            <DropdownMenuItem onClick={() => setSortType("marketcap")}>Market Cap</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortType("tradedat")}>Traded At</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <table className="min-w-full text-left border-separate border-spacing-y-2">
        <thead />
        <tbody>
          <AnimatePresence initial={false}>
            {currentShares.map((coin) => coin && [
              <motion.tr
                key={coin.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ type: "tween", duration: 0.18, ease: "easeInOut" }}
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
                        <div className="text-white text-base font-semibold mb-2">{coin.name} ({coin.symbol})</div>
                        <div className="text-gray-300 text-sm mb-2">{coin.description}</div>
                        <div className="flex gap-3 mt-2">
                          {coin.telegramLink && (
                            <a href={coin.telegramLink} target="_blank" rel="noopener noreferrer" title="Telegram" className="text-gray-400">
                              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><title>Telegram</title><path d="M9.04 13.94l-.37 3.66c.53 0 .76-.23 1.04-.5l2.5-2.38 5.18 3.78c.95.52 1.62.25 1.86-.88l3.38-15.88c.31-1.44-.52-2-1.44-1.66L2.2 9.24c-1.39.56-1.37 1.36-.24 1.7l4.1 1.28 9.52-6.02c.45-.28.87-.13.53.18z" /></svg>
                            </a>
                          )}
                          {coin.websiteLink && (
                            <a href={coin.websiteLink} target="_blank" rel="noopener noreferrer" title="Website" className="text-gray-400">
                              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><title>Website</title><circle cx="12" cy="12" r="10" /></svg>
                            </a>
                          )}
                          {coin.twitterLink && (
                            <a href={coin.twitterLink} target="_blank" rel="noopener noreferrer" title="Twitter" className="text-gray-400">
                              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><title>Twitter</title><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 012 19.54c-.63 0-1.25-.04-1.86-.11A12.13 12.13 0 006.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0024 4.59a8.36 8.36 0 01-2.54.7z" /></svg>
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <DominanceRechart
                          points={mockDominanceChartData.map(data => ({
                            timestamp: data.timestamp,
                            [coin.symbol]: data.shares?.[Number(coin.id)] ?? 0
                          }))}
                          coins={[{
                            symbol: coin.symbol,
                            name: coin.name,
                            color: coin.color
                          }]}
                          height={220}
                          compact={true}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ),
            ])}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default RoundCoinTable;
