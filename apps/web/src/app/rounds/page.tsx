"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import DominanceRechart from "@/components/DominanceRechart";
import { mockCoinMetadata, mockDominanceChartData, mockChampionCoinMetadata } from "@/mock/mockData";
import { useBattleClock } from "@/app/providers/BattleClockProvider";
import { cn } from "@workspace/shadcn/lib/utils";
import Image from "next/image";

// 型安全のためにデフォルトのアイコンを用意
const DEFAULT_ICON = "/images/mockmemes/RACC.webp";

// 安全にmockCoinMetadataの要素を取得する関数
function getSafeIcon(index: number): string {
  if (!mockCoinMetadata || !mockCoinMetadata[index]) {
    return DEFAULT_ICON;
  }
  return mockCoinMetadata[index].icon || DEFAULT_ICON;
}

// 安全にシンボルを取得する関数
function getSafeSymbol(index: number): string {
  if (!mockCoinMetadata || !mockCoinMetadata[index]) {
    return "COIN";
  }
  return mockCoinMetadata[index].symbol || "COIN";
}

const rounds = [
  {
    round: 4,
    status: "Upcoming Battle",
    state: "waiting",
    metrics: { mcap: "$0", volume: "$0", memes: 0, traders: 0 },
    startTime: "05/27 00:00",
    endTime: "05/28 01:00",
  },
  {
    round: 3,
    status: "Current Battle",
    state: "active",
    metrics: { mcap: "$120.00K", volume: "$40K", memes: 12, traders: 80 },
    startTime: "05/24 00:00",
    endTime: "05/25 01:00",
  },
  {
    round: 2,
    status: "Completed",
    state: "ended",
    metrics: { mcap: "$200.00K", volume: "$100K", memes: 30, traders: 150 },
    startTime: "05/21 00:00",
    endTime: "05/22 01:00",
    champion: mockChampionCoinMetadata?.[1] || null,
  },
  {
    round: 1,
    status: "Completed",
    state: "ended",
    metrics: { mcap: "$90.00K", volume: "$20K", memes: 8, traders: 40 },
    startTime: "05/18 00:00",
    endTime: "05/19 01:00",
    champion: mockChampionCoinMetadata?.[0] || null,
  }
];

function getChartPoints(roundIndex: number) {
  // mockDominanceChartDataがない場合は空の配列を返す
  if (!mockDominanceChartData || !mockDominanceChartData.length) {
    return [];
  }

  // 各ラウンドごとに若干異なるグラフを表示するための調整
  const offset = roundIndex * 100;
  const startIndex = offset % mockDominanceChartData.length;
  const endIndex = (startIndex + 200) % mockDominanceChartData.length;

  const dataSlice = endIndex > startIndex
    ? mockDominanceChartData.slice(startIndex, endIndex)
    : [...mockDominanceChartData.slice(startIndex), ...mockDominanceChartData.slice(0, endIndex)];

  return dataSlice.map((point) => ({
    timestamp: point.timestamp,
    ...((point.shares || []).reduce(
      (acc, share, index) => {
        const symbol = mockCoinMetadata && mockCoinMetadata[index]
          ? mockCoinMetadata[index].symbol.toLowerCase()
          : `coin${index}`;

        return Object.assign(acc, { [symbol]: share });
      },
      {},
    )),
  }));
}

function getChartCoins() {
  return mockCoinMetadata.map((coin) => ({
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    color: coin.color,
  }));
}

export default function RoundsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent');
  const chartCoins = getChartCoins();
  const { currentRound } = useBattleClock();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (intent === 'create-coin') {
      setShowCreateModal(true);
    }
  }, [intent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 py-12 px-4 overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-10 z-0" />

      <h1 className="text-5xl font-extrabold text-white text-center mb-14 tracking-tight">
        Battle Rounds
      </h1>

      <div className="max-w-7xl mx-auto flex flex-col gap-8 z-10 relative">
        <AnimatePresence>
          {rounds.map((r, i) => (
            <motion.div
              key={r.round}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.33, 1, 0.68, 1]
              }}
              className={cn(
                "relative rounded-2xl shadow-2xl backdrop-blur-sm border p-6 overflow-hidden",
                r.state === 'active'
                  ? "border-purple-500 bg-purple-900/20 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                  : r.state === 'ended'
                  ? "border-gray-700/50 bg-gray-900/70"
                  : (intent === 'create-coin' && r.state === 'waiting')
                  ? "border-purple-500/60 bg-gray-900/70 shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                  : "border-gray-700/50 bg-gray-900/70",
                r.state === 'waiting' ? "py-4" : ""
              )}
            >
              {/* State indicator line */}
              <div
                className={cn(
                  "absolute top-0 left-0 h-full w-2",
                  r.state === 'active' ? "bg-purple-500 animate-pulse" : "bg-gray-700",
                )}
              />

              <div className="flex flex-col gap-6">
                {/* Round header */}
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "text-6xl font-black",
                    r.state === 'active' ? "text-purple-400" : r.state === 'ended' ? "text-gray-600" : "text-gray-700"
                  )}>
                    #{r.round}
                  </div>
                  <div>
                    <div className={cn(
                      "text-3xl font-extrabold tracking-tight mb-1",
                      r.state === 'active' ? "text-purple-300" : "text-white"
                    )}>
                      {r.status}
                      {r.state === 'active' && (
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 animate-pulse">
                          ● LIVE
                        </span>
                      )}
                    </div>
                    <div className="text-gray-200 text-base flex items-center gap-3 font-medium">
                      <span>Start: {r.startTime}</span>
                      <span className="text-gray-500">•</span>
                      <span>End: {r.endTime}</span>
                    </div>
                  </div>
                </div>


                {r.state !== 'waiting' && (
                  <div className="flex flex-col gap-6">
                    {/* Main content flex container */}
                    <div className="flex flex-col xl:flex-row gap-6">
                      {/* Left column */}
                      <div className="flex-1">
                        {/* Metrics row - always visible */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 + 0.2 }}
                            className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 flex flex-col items-center"
                          >
                            <span className="text-gray-400 text-sm">Market Cap</span>
                            <span className="text-white font-bold text-xl">{r.metrics.mcap}</span>
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 + 0.3 }}
                            className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 flex flex-col items-center"
                          >
                            <span className="text-gray-400 text-sm">Volume</span>
                            <span className="text-white font-bold text-xl">{r.metrics.volume}</span>
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 + 0.4 }}
                            className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 flex flex-col items-center"
                          >
                            <span className="text-gray-400 text-sm">Meme Count</span>
                            <span className="text-white font-bold text-xl">{r.metrics.memes}</span>
                          </motion.div>
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 + 0.5 }}
                            className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 flex flex-col items-center"
                          >
                            <span className="text-gray-400 text-sm">Trader Count</span>
                            <span className="text-white font-bold text-xl">{r.metrics.traders}</span>
                          </motion.div>
                        </div>

                        {/* Display chart for active and ended rounds */}
                        <div className="bg-black/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 mb-4">
                          <DominanceRechart
                            points={getChartPoints(i)}
                            coins={chartCoins}
                            height={200}
                            compact={false}
                            hideLegend={false}
                            showAllTime={true}
                          />
                        </div>

                        {/* Coin list for active and completed rounds */}
                        {mockCoinMetadata && mockCoinMetadata.length >= 4 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {mockCoinMetadata.slice(0, 4).map((coin, j) => {
                              // 安全にアクセスするためのnull/undefinedチェック
                              if (!coin || !coin.icon) return null;

                              return (
                                <motion.div
                                  key={coin.id}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: j * 0.1 }}
                                  className="bg-black/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 flex items-center gap-3 hover:bg-black/40 transition-colors cursor-pointer"
                                >
                                  <Image
                                    src={coin.icon}
                                    alt={coin.symbol}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                  <div>
                                    <div className="font-bold text-white">{coin.symbol}</div>
                                    <div className="text-xs text-gray-400">{j === 0 ? '32%' : j === 1 ? '28%' : j === 2 ? '22%' : '18%'} share</div>
                                  </div>
                                  <div className="ml-auto">
                                    <span className={j === 0 ? "text-green-400" : j === 1 ? "text-green-300" : j === 2 ? "text-red-300" : "text-red-400"}>
                                      {j === 0 ? '+2.4%' : j === 1 ? '+1.2%' : j === 2 ? '-0.8%' : '-1.5%'}
                                    </span>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Champion card for ended rounds */}
                      {r.state === 'ended' && (
                        <div className="w-full xl:w-80 xl:h-auto">
                          <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-2xl border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.25)] bg-black/70 transition-transform duration-200 hover:scale-[1.02]">
                            {/* Champion badge */}
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold py-1 px-3 rounded-lg text-xs uppercase tracking-wider flex items-center shadow-lg z-20">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-3 h-3 mr-1"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Champion
                            </div>

                            <Image
                              src={getSafeIcon(r.round % mockCoinMetadata.length)}
                              alt={getSafeSymbol(r.round % mockCoinMetadata.length)}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1280px) 100vw, 320px"
                            />

                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-4 py-3 flex flex-col gap-0.5">
                              <div className="text-2xl font-extrabold text-yellow-400 tracking-wide truncate">{getSafeSymbol(r.round % mockCoinMetadata.length)}</div>
                              <div className="text-sm text-blue-200 truncate mb-2">Round {r.round} Winner</div>

                              <div className="grid grid-cols-2 gap-1 border-t border-gray-700 pt-2">
                                <div>
                                  <span className="text-gray-400 text-xs block">MCap</span>
                                  <div className="flex items-center">
                                    <span className="text-white text-sm font-bold">{r.metrics.mcap}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-400 text-xs block">volume</span>
                                  <div className="flex items-center">
                                    <span className="text-white text-sm font-bold">{r.metrics.volume}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* "Not Yet Determined" card for active rounds */}
                      {r.state === 'active' && (
                        <div className="w-full xl:w-80 xl:h-auto">
                          <div className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-2xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.25)] bg-black/70 transition-transform duration-200 hover:scale-[1.02]">
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-1 px-3 rounded-lg text-xs uppercase tracking-wider flex items-center shadow-lg z-20">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              In Progress
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                              <div className="w-24 h-24 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center mb-6 animate-pulse">
                                <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <h3 className="text-2xl font-extrabold text-white mb-2 text-center">Champion Not Yet Determined</h3>
                              <p className="text-gray-400 text-center max-w-xs mb-6 px-4">Battle in progress! The champion will be determined at the end of this round.</p>
                              <button className="px-6 py-3 rounded-lg bg-purple-800 hover:bg-purple-700 text-white font-bold border border-purple-500/50 transition-all hover:scale-105 shadow-lg">
                                Join The Battle
                              </button>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-4 py-3">
                              <div className="text-center text-lg font-bold text-white animate-pulse">
                                Battle Ends: {r.endTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Compressed layout for upcoming rounds */}
                {r.state === 'waiting' && (
                  <div className="flex flex-row items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Be the first to create a meme coin!</h3>
                          <p className="text-gray-400">Upcoming round starts on {r.startTime}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-6 py-3 rounded-lg bg-purple-800 hover:bg-purple-700 text-white font-bold border border-purple-500/50 transition-all hover:scale-105 shadow-lg"
                    >
                      Create Your Meme Coin
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create coin modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => {
                setShowCreateModal(false);
                if (intent === 'create-coin') {
                  router.push('/rounds');
                }
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl rounded-2xl bg-gray-900 border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] overflow-hidden z-50"
            >
              <div className="p-6">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-white">Create Your Meme Coin</h2>
                <p className="text-gray-300 text-center mb-8">Be part of the next battle round by creating your own meme coin!</p>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Coin Symbol</label>
                    <input type="text" className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="DOGE" />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Coin Name</label>
                    <input type="text" className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Dogecoin" />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Upload Icon</label>
                    <div className="w-full h-32 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center bg-black/30 cursor-pointer hover:border-purple-500 transition-colors">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-1 text-sm text-gray-400">Click to upload or drag and drop</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      if (intent === 'create-coin') {
                        router.push('/rounds');
                      }
                    }}
                    className="px-6 py-3 rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-3 rounded-lg font-bold text-white bg-purple-700 hover:bg-purple-600 transition-all hover:scale-[1.03]">
                    Create Coin
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}