"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";
import { useBattleClock } from "@/app/providers/BattleClockProvider";
import { ROUNDS } from "./constants";
import { getChartPoints, getChartCoins, getSafeIcon, getSafeSymbol } from "./utils";
import { CreateCoinModal } from "./components/CreateCoinModal";
import { Card, CardContent } from "@workspace/shadcn/components/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import Image from "next/image";
import { RoundState } from "./types";

// Define types for our dashboard data
interface TokenColors {
  [key: string]: string;
}

interface ChartDataPoint {
  time: string;
  [key: string]: number | string;
}

interface Winner {
  name: string;
  round: string;
  mcap: string;
  volume: string;
  image: string;
}

interface DashboardData {
  id: string;
  status: string;
  state: RoundState;
  startDate: string;
  endDate: string;
  marketCap: string;
  volume: string;
  memeCount: string;
  traderCount: string;
  chartData: ChartDataPoint[];
  winner: Winner | null;
}

interface DashboardSectionProps {
  data: DashboardData;
  tokenColors: TokenColors;
  onCreateClick?: () => void;
}

interface StatCardProps {
  title: string;
  value: string;
}

export default function RoundsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent');
  const chartCoins = getChartCoins(mockCoinMetadata);
  const { currentRound } = useBattleClock();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (intent === 'create-coin') {
      setShowCreateModal(true);
    }
  }, [intent]);

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    if (intent === 'create-coin') {
      router.push('/rounds');
    }
  };

  const dashboardData = ROUNDS.map((round, i) => {
    return {
      id: `#${round.round}`,
      status: round.status,
      state: round.state as RoundState,
      startDate: round.startTime,
      endDate: round.endTime,
      marketCap: round.metrics.mcap,
      volume: round.metrics.volume,
      memeCount: round.metrics.memes.toString(),
      traderCount: round.metrics.traders.toString(),
      chartData: getChartPoints(mockDominanceChartData, mockCoinMetadata, i).map(point => {
        const time = typeof point.timestamp === 'number'
          ? `${Math.floor(point.timestamp / 60).toString().padStart(2, '0')}:${(point.timestamp % 60).toString().padStart(2, '0')}`
          : point.timestamp;

        // Extract token data from point
        const tokenData: {[key: string]: number} = {};
        Object.keys(point).forEach(key => {
          if (key !== 'timestamp') {
            tokenData[key.toUpperCase()] = point[key] as number;
          }
        });

        return {
          time,
          ...tokenData
        };
      }),
      winner: round.state === 'ended' ? {
        name: getSafeSymbol(mockCoinMetadata, round.round % mockCoinMetadata.length),
        round: `Round ${round.round} Winner`,
        mcap: round.metrics.mcap,
        volume: round.metrics.volume,
        image: getSafeIcon(mockCoinMetadata, round.round % mockCoinMetadata.length)
      } : null
    };
  });

  // Token colors - matching to the colors used in the application
  const tokenColors: TokenColors = mockCoinMetadata.reduce((acc: TokenColors, coin) => {
    acc[coin.symbol.toUpperCase()] = coin.color;
    return acc;
  }, {});

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0A0D14] py-12 px-4 overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-5 z-0" />

      <h1 className="text-5xl font-extrabold text-white text-center mb-14 tracking-tight z-10 relative">
        Battle Rounds
      </h1>

      <div className="max-w-7xl w-full mx-auto space-y-8 z-10 relative">
        {dashboardData.map((dashboard) => (
          <DashboardSection
            key={dashboard.id}
            data={dashboard}
            tokenColors={tokenColors}
            onCreateClick={dashboard.state === 'waiting' ? handleCreateClick : undefined}
          />
        ))}
      </div>

      <CreateCoinModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}

function DashboardSection({ data, tokenColors, onCreateClick }: DashboardSectionProps) {
  // Handle waiting round (upcoming battle)
  if (data.state === 'waiting' && onCreateClick) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: [0.33, 1, 0.68, 1]
        }}
      >
        <Card className="bg-[#141923] border-[#2D3748] overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-400">{data.id}</h1>
                <span className="text-xl font-bold">{data.status}</span>
              </div>
              <div className="text-sm text-gray-300 mt-2 md:mt-0">
                Start: {data.startDate} · End: {data.endDate}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-xl text-gray-300 mb-6">
                This battle hasn't started yet. Create a coin to participate!
              </p>
              <button
                onClick={onCreateClick}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
              >
                Create Coin
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{
        duration: 0.5,
        delay: 0.1,
        ease: [0.33, 1, 0.68, 1]
      }}
    >
      <div
        className={`bg-[#141923] w-full border border-[#2D3748] rounded-lg overflow-hidden ${
          data.state === 'active' ? 'shadow-[0_0_15px_rgba(168,85,247,0.4)]' : ''
        }`}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Header for mobile view */}
          <div className="p-4 lg:hidden">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="text-4xl font-bold text-gray-400">{data.id}</h1>
                  <span className={`text-xl font-bold ${data.state === 'active' ? 'text-purple-300' : ''}`}>
                    {data.status}
                    {data.state === 'active' && (
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 animate-pulse">
                        ● LIVE
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-300">
                Start: {data.startDate} · End: {data.endDate}
              </div>
            </div>
          </div>

          {/* Left section - Main content */}
          <div className="flex-1 p-6">
            {/* Header for desktop */}
            <div className="hidden lg:flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-400">{data.id}</h1>
                <span className={`text-xl font-bold ${data.state === 'active' ? 'text-purple-300' : ''}`}>
                  {data.status}
                  {data.state === 'active' && (
                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 animate-pulse">
                      ● LIVE
                    </span>
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                Start: {data.startDate} · End: {data.endDate}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="Market Cap" value={data.marketCap} />
              <StatCard title="Volume" value={data.volume} />
              <StatCard title="Meme Count" value={data.memeCount} />
              <StatCard title="Trader Count" value={data.traderCount} />
            </div>

            {/* Chart */}
            <div className="bg-[#171923] rounded-lg border border-[#2D3748] overflow-hidden">
              <div className="h-[240px] px-2 pt-4 pb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData}>
                    <XAxis
                      dataKey="time"
                      stroke="#4A5568"
                      tick={{ fill: "#4A5568" }}
                      axisLine={{ stroke: "#2D3748" }}
                    />
                    <YAxis
                      stroke="#4A5568"
                      tick={{ fill: "#4A5568" }}
                      axisLine={{ stroke: "#2D3748" }}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 'dataMax + 15']}
                    />
                    {Object.keys(tokenColors).map(token => (
                      <Line
                        key={token}
                        type="monotone"
                        dataKey={token}
                        stroke={tokenColors[token] || '#777'}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-6 justify-center py-3 border-t border-[#2D3748] bg-[#13161F]">
                {Object.keys(tokenColors).map(token => (
                  <div key={token} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tokenColors[token] || '#777' }}
                    ></div>
                    <span>{token}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right section - Champion Card */}
          {(data.state === 'active' || (data.state === 'ended' && data.winner)) && (
            <div className="w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l border-[#2D3748]">
              {data.state === 'active' ? (
                <div className="h-full flex flex-col bg-black bg-opacity-70">
                  <div className="bg-purple-500 text-white text-center py-1 text-sm font-medium">
                    <span className="inline-flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                      IN PROGRESS
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-6 h-full">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Champion Not Yet Determined
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Battle in progress! The champion will be determined at the end of this round.
                    </p>
                    <button className="px-6 py-2 rounded-lg bg-purple-800 hover:bg-purple-700 text-white font-bold border border-purple-500/50 transition-all hover:scale-105 shadow-lg">
                      Join The Battle
                    </button>
                  </div>
                </div>
              ) : data.winner && (
                <div className="flex flex-col h-full">
                  {/* Champion badge */}
                  <div className="bg-[#F6AD37] text-black text-center py-1 text-sm font-medium">
                    <span className="inline-flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                        <path d="M4 22h16"></path>
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                      </svg>
                      CHAMPION
                    </span>
                  </div>

                  {/* Image - taking 75% of the column height */}
                  <div className="flex-grow bg-black" style={{ flex: '3' }}>
                    <div className="relative w-full h-full">
                      <Image
                        src={data.winner.image}
                        alt={`${data.winner.name} mascot`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Info section - taking 25% of the column height */}
                  <div className="bg-[#141923] p-4" style={{ flex: '1' }}>
                    <div>
                      <h2 className="text-2xl font-bold text-[#F6AD37]">{data.winner.name}</h2>
                      <p className="text-gray-400 text-sm">{data.winner.round}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-gray-400 text-xs">MCap</p>
                        <p className="font-bold text-sm">{data.winner.mcap}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">volume</p>
                        <p className="font-bold text-sm">{data.winner.volume}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-[#171923] rounded-lg p-3 border border-[#2D3748]">
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}