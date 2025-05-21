"use client";

import CommunicationPanel from "@/components/CommunicationPanel";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";
import { Card, CardContent } from "@workspace/shadcn/components/card";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChampCard } from "./components/ChampCard";
import { ClaimOutcomeModal } from "./components/ClaimOutcomeModal";
import { CreateCoinModal } from "./components/CreateCoinModal";
import { ROUNDS } from "./constants";
import type { RoundState } from "./types";
import { getChartPoints, getSafeIcon, getSafeSymbol } from "./utils";

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
  loserIssuance?: string;
  topShare?: number;
}

interface DashboardSectionProps {
  data: DashboardData;
  tokenColors: TokenColors;
  onCreateClick?: () => void;
  onClaimClick?: (winnerName: string, share: number, roundId: string) => void;
}

interface StatCardProps {
  title: string;
  value: string;
}

export default function RoundsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimData, setClaimData] = useState({
    winner: { name: "", share: 0 },
    roundId: "",
  });

  useEffect(() => {
    if (intent === "create-coin") {
      setShowCreateModal(true);
    }
  }, [intent]);

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    if (intent === "create-coin") {
      router.push("/rounds");
    }
  };

  const handleClaimClick = (
    winnerName: string,
    share: number,
    roundId: string,
  ) => {
    setClaimData({
      winner: {
        name: winnerName,
        share,
      },
      roundId,
    });
    setShowClaimModal(true);
  };

  const handleCloseClaimModal = () => {
    setShowClaimModal(false);
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
      chartData: getChartPoints(
        mockDominanceChartData,
        mockCoinMetadata,
        i,
      ).map((point) => {
        const time =
          typeof point.timestamp === "number"
            ? `${Math.floor(point.timestamp / 60)
                .toString()
                .padStart(
                  2,
                  "0",
                )}:${(point.timestamp % 60).toString().padStart(2, "0")}`
            : point.timestamp;

        // Extract token data from point
        const tokenData: { [key: string]: number } = {};
        for (const key of Object.keys(point)) {
          if (key !== "timestamp") {
            tokenData[key.toUpperCase()] = point[key] as number;
          }
        }

        return {
          time,
          ...tokenData,
        };
      }),
      winner:
        round.state === "ended"
          ? {
              name: getSafeSymbol(
                mockCoinMetadata,
                round.round % mockCoinMetadata.length,
              ),
              round: `Round ${round.round} Winner`,
              mcap: round.metrics.mcap,
              volume: round.metrics.volume,
              image: getSafeIcon(
                mockCoinMetadata,
                round.round % mockCoinMetadata.length,
              ),
            }
          : null,
      loserIssuance: round.metrics.loserIssuance,
      topShare: round.topShare,
    };
  });

  // Token colors - matching to the colors used in the application
  const tokenColors: TokenColors = mockCoinMetadata.reduce(
    (acc: TokenColors, coin) => {
      acc[coin.symbol.toUpperCase()] = coin.color;
      return acc;
    },
    {},
  );

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="flex flex-1">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-6 pt-4">
          <div className="max-w-7xl w-full mx-auto space-y-8">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFEB80] to-[#FFC700] text-center mb-14 tracking-tight z-10 relative drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]">
              Battle Rounds
            </h1>

            {dashboardData.map((dashboard) => (
              <DashboardSection
                key={dashboard.id}
                data={dashboard}
                tokenColors={tokenColors}
                onCreateClick={
                  dashboard.state === "waiting" ? handleCreateClick : undefined
                }
                onClaimClick={handleClaimClick}
              />
            ))}
          </div>
        </main>

        {/* Right side chat panel */}
        <aside className="hidden lg:block">
          <CommunicationPanel />
        </aside>
      </div>

      <CreateCoinModal isOpen={showCreateModal} onClose={handleCloseModal} />
      <ClaimOutcomeModal
        isOpen={showClaimModal}
        onClose={handleCloseClaimModal}
        winner={claimData.winner}
        roundId={claimData.roundId}
      />
    </div>
  );
}

function DashboardSection({
  data,
  tokenColors,
  onCreateClick,
  onClaimClick,
}: DashboardSectionProps) {
  // Handle waiting round (upcoming battle)
  if (data.state === "waiting" && onCreateClick) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: [0.33, 1, 0.68, 1],
        }}
      >
        <Card className="bg-gradient-to-br from-[#1D1F2B] to-[#13151E] border border-[#343850]/80 shadow-[0_10px_50px_-12px_rgba(0,0,0,0.7),0_0_1px_0_rgba(255,215,0,0.1)] backdrop-blur-sm rounded-2xl overflow-hidden relative">
          {/* State indicator line */}
          <div className="absolute top-0 left-0 h-full w-2 bg-gray-700" />

          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-200 drop-shadow-md">
                  {data.id}
                </h1>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFC700]">
                  {data.status}
                </span>
              </div>
              <div className="text-sm text-gray-400 mt-2 md:mt-0 font-medium tracking-wide">
                Start: {data.startDate} · End: {data.endDate}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-xl text-gray-300 mb-8 font-medium">
                This battle hasn&apos;t started yet. Create a coin to
                participate!
              </p>
              <button
                type="button"
                onClick={onCreateClick}
                className="group relative px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFAA00] hover:from-[#FFE345] hover:to-[#FFB52E] text-black rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-[0_5px_30px_-10px_rgba(255,215,0,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Create Coin</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transition-transform duration-300 transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    role="img"
                    aria-label="Arrow right"
                  >
                    <title>Arrow right</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
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
        ease: [0.33, 1, 0.68, 1],
      }}
    >
      <div
        className={`bg-gradient-to-br from-[#1D1F2B] to-[#13151E] w-full border border-[#343850]/80 rounded-2xl overflow-hidden backdrop-blur-sm relative ${
          data.state === "active"
            ? "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7),0_0_15px_0_rgba(168,85,247,0.25)]"
            : "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.7)]"
        }`}
      >
        {/* State indicator line */}
        <div
          className={`absolute top-0 left-0 h-full w-2 ${
            data.state === "active"
              ? "bg-purple-500 animate-pulse"
              : "bg-gray-700"
          }`}
        />

        {/* グリッドレイアウトに変更 - 動的調整の2カラム構造 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto]">
          {/* 左側 - メインコンテンツ */}
          <div className="p-6">
            {/* Header for mobile view */}
            <div className="lg:hidden">
              <div className="flex flex-col space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h1 className="text-4xl font-bold text-gray-200 drop-shadow-md">
                      {data.id}
                    </h1>
                    <span
                      className={`text-xl font-bold ${
                        data.state === "active"
                          ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-500"
                          : "text-gray-300"
                      }`}
                    >
                      {data.state === "active" ? "In Progress" : data.status}
                      {data.state === "active" && (
                        <span className="ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 animate-pulse border border-purple-400/30">
                          ● LIVE
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-400 font-medium tracking-wide">
                  Start: {data.startDate} · End: {data.endDate}
                </div>
              </div>
            </div>

            {/* Header for desktop */}
            <div className="hidden lg:flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-200 drop-shadow-md">
                  {data.id}
                </h1>
                <span
                  className={`text-xl font-bold ${
                    data.state === "active"
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-500"
                      : "text-gray-300"
                  }`}
                >
                  {data.state === "active" ? "In Progress" : data.status}
                  {data.state === "active" && (
                    <span className="ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 animate-pulse border border-purple-400/30">
                      ● LIVE
                    </span>
                  )}
                </span>
              </div>
              <div className="text-sm text-gray-400 font-medium tracking-wide">
                Start: {data.startDate} · End: {data.endDate}
              </div>
            </div>

            {/* Action/description section: show for completed and active rounds */}
            {data.state === "ended" && data.winner && (
              <div className="flex items-center gap-4 mb-6">
                <button
                  type="button"
                  onClick={() =>
                    onClaimClick?.(
                      data.winner?.name || "",
                      data.topShare || 42,
                      data.id,
                    )
                  }
                  className="rounded-full px-5 py-2 text-xl font-bold border-2 border-transparent bg-black transition-all duration-150 cursor-pointer text-transparent bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text hover:border-yellow-400"
                >
                  Claim outcome
                </button>
                <span className="text-gray-400 text-base max-w-xs whitespace-normal block">
                  The {data.winner.name} won the round with a{" "}
                  {data.topShare || 42}% share. The remaining{" "}
                  {100 - (data.topShare || 42)}% memes was burned.
                </span>
              </div>
            )}
            {data.state === "active" && (
              <div className="flex flex-row items-center gap-4 mb-6">
                <button
                  type="button"
                  className="rounded-full px-5 py-2 text-xl font-bold border-2 border-purple-400 bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg hover:from-violet-500 hover:to-purple-500 transition-all duration-150 cursor-pointer shrink-0"
                >
                  Join the Battle
                </button>
                <div className="text-gray-400 text-base whitespace-normal max-w-xs">
                  The battle is heating up! Join now and help your favorite meme
                  coin win the round.
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <StatCard title="Market Cap" value={data.marketCap} />
              <StatCard title="Volume" value={data.volume} />
              <StatCard title="Meme Count" value={data.memeCount} />
              <StatCard title="Trader Count" value={data.traderCount} />
              <StatCard
                title="LOSER Inflation"
                value={Number.parseFloat(
                  (data.loserIssuance || "0").replace(/[^\d.]/g, ""),
                ).toString()}
              />
            </div>

            {/* Chart */}
            <div className="bg-gradient-to-br from-[#181B27] to-[#0F1017] rounded-xl border border-[#343850]/50 overflow-hidden backdrop-filter backdrop-blur-sm shadow-inner">
              <div className="h-[240px] px-2 pt-4 pb-6 relative">
                {/* Chart subtle grid overlay */}
                <div className="absolute inset-0 bg-[url('/images/grid-chart.svg')] bg-center opacity-[0.07] z-0" />

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData}>
                    <defs>
                      {Object.keys(tokenColors).map((token) => (
                        <linearGradient
                          key={`gradient-${token}`}
                          id={`gradient-${token}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={tokenColors[token] || "#FFD700"}
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor={tokenColors[token] || "#FFD700"}
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis
                      dataKey="time"
                      stroke="#5A5A6A"
                      tick={{ fill: "#5A5A6A" }}
                      axisLine={{ stroke: "#343850" }}
                      tickLine={{ stroke: "#343850" }}
                    />
                    <YAxis
                      stroke="#5A5A6A"
                      tick={{ fill: "#5A5A6A" }}
                      axisLine={{ stroke: "#343850" }}
                      tickLine={{ stroke: "#343850" }}
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, "dataMax + 15"]}
                    />
                    {Object.keys(tokenColors).map((token) => (
                      <Line
                        key={token}
                        type="monotone"
                        dataKey={token}
                        stroke={tokenColors[token] || "#FFD700"}
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{
                          r: 6,
                          stroke: tokenColors[token] || "#FFD700",
                          strokeWidth: 2,
                          fill: "#13151E",
                        }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-6 justify-center py-3 border-t border-[#343850]/70 bg-[#13151E]/80 backdrop-blur-sm">
                {Object.keys(tokenColors).map((token) => (
                  <div
                    key={token}
                    className="flex items-center gap-2 transition-transform hover:scale-105 duration-300"
                  >
                    <div
                      className="w-[10px] h-[10px] rounded-full ring-2 ring-opacity-50"
                      style={
                        {
                          backgroundColor: tokenColors[token] || "#FFD700",
                          boxShadow: `0 0 10px ${tokenColors[token] || "#FFD700"}50`,
                          "--ring-color": tokenColors[token] || "#FFD700",
                        } as React.CSSProperties
                      }
                    />
                    <span className="text-gray-300 font-medium tracking-wide">
                      {token}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右側 - Champion Card - アスペクト比3:4を厳密に保持 */}
          {data.state === "active" ||
          (data.state === "ended" && data.winner) ? (
            <div className="p-6" style={{ height: "calc(100%)" }}>
              {/* BattleRoundCardとの余白上下右が等幅であること */}
              <div
                style={{
                  height: "100%",
                  aspectRatio: "3/4", // 重要: w:h = 3:4 のアスペクト比を厳守
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {data.state === "active" ? (
                  <div className="w-full h-full bg-gradient-to-br from-black/80 to-[#13151E]/90 rounded-xl flex items-center justify-center border-2 border-purple-500/30 backdrop-blur-sm relative overflow-hidden group">
                    {/* Animated pulsing effect */}
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-purple-500 opacity-[0.03] blur-[50px] rounded-full" />

                    <span className="text-white text-lg font-bold opacity-80 tracking-wide group-hover:scale-105 transition-transform duration-300">
                      Battle in progress
                    </span>
                  </div>
                ) : (
                  data.winner && (
                    <ChampCard
                      image={data.winner.image}
                      name={data.winner.name}
                      round={data.winner.round}
                      mcap={data.winner.mcap}
                      volume={data.winner.volume}
                    />
                  )
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#1A1D2A]/80 to-[#13151E] rounded-xl p-4 border border-[#343850]/50 shadow-inner group hover:border-[#343850]/70 transition-all duration-300 overflow-hidden relative">
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight">
        {value}
      </p>
    </div>
  );
}
