import { ActiveRoundCard } from "@/app/rounds/components/ActiveRoundCard";
import { RoundChart } from "@/app/rounds/components/RoundChart";
import { RoundCoins } from "@/app/rounds/components/RoundCoins";
import { RoundMetrics } from "@/app/rounds/components/RoundMetrics";
import { WaitingRoundCard } from "@/app/rounds/components/WaitingRoundCard";
import type { ChartCoin, ChartPoint, Round } from "@/app/rounds/types";
import { getSafeIcon, getSafeSymbol } from "@/app/rounds/utils";
import { ChampionCard } from "@/components/ChampionCard";
import { cn } from "@workspace/shadcn/lib/utils";
import type { MemeMetadata } from "@workspace/types";
import { motion } from "framer-motion";
import React from "react";

interface RoundCardProps {
  round: Round;
  index: number;
  chartPoints: ChartPoint[];
  chartCoins: ChartCoin[];
  mockCoinMetadata: MemeMetadata[];
  onCreateClick: () => void;
}

export function RoundCard({
  round,
  index,
  chartPoints,
  chartCoins,
  mockCoinMetadata,
  onCreateClick,
}: RoundCardProps) {
  return (
    <motion.div
      key={round.round}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.33, 1, 0.68, 1],
      }}
      className={cn(
        "relative rounded-2xl shadow-2xl backdrop-blur-sm border p-6 overflow-hidden",
        round.state === "active"
          ? "border-purple-500 bg-purple-900/20 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
          : round.state === "ended"
            ? "border-gray-700/50 bg-gray-900/70"
            : "border-gray-700/50 bg-gray-900/70",
        round.state === "waiting" ? "py-4" : "",
      )}
    >
      {/* State indicator line */}
      <div
        className={cn(
          "absolute top-0 left-0 h-full w-2",
          round.state === "active"
            ? "bg-purple-500 animate-pulse"
            : "bg-gray-700",
        )}
      />

      <div className="flex flex-col">
        {/* Header with round number, status, and date */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "text-6xl font-black",
              round.state === "active"
                ? "text-purple-400"
                : round.state === "ended"
                  ? "text-gray-600"
                  : "text-gray-700",
            )}
          >
            #{round.round}
          </div>

          <div className="flex items-center">
            <div>
              <div
                className={cn(
                  "text-3xl font-extrabold tracking-tight mb-0",
                  round.state === "active" ? "text-purple-300" : "text-white",
                )}
              >
                {round.status}
                {round.state === "active" && (
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 animate-pulse">
                    ● LIVE
                  </span>
                )}
              </div>
            </div>

            <div className="text-gray-200 text-base ml-6 font-medium">
              <span>Start: {round.startTime}</span>
              <span className="text-gray-500 mx-2">•</span>
              <span>End: {round.endTime}</span>
            </div>
          </div>
        </div>

        {round.state !== "waiting" ? (
          <div className="flex items-start">
            {/* Left column */}
            <div className="flex-1 flex flex-col gap-4 pr-6">
              <div className="grid grid-cols-4 gap-2">
                <RoundMetrics metrics={round.metrics} index={index} />
              </div>
              <RoundChart points={chartPoints} coins={chartCoins} />
              <RoundCoins coins={mockCoinMetadata} />
            </div>

            {/* Right column - Champion or Active card */}
            {(round.state === "ended" || round.state === "active") && (
              <div className="w-[320px]">
                {round.state === "ended" && (
                  <ChampionCard
                    id={
                      mockCoinMetadata[round.round % mockCoinMetadata.length]
                        ?.id ?? "1"
                    }
                    imageUrl={getSafeIcon(
                      mockCoinMetadata,
                      round.round % mockCoinMetadata.length,
                    )}
                    symbol={getSafeSymbol(
                      mockCoinMetadata,
                      round.round % mockCoinMetadata.length,
                    )}
                    name={`Round ${round.round} Winner`}
                    mcap={Number(round.metrics.mcap)}
                    round={round.round}
                  />
                )}
                {round.state === "active" && (
                  <ActiveRoundCard endTime={round.endTime} />
                )}
              </div>
            )}
          </div>
        ) : (
          <WaitingRoundCard
            startTime={round.startTime}
            onCreateClick={onCreateClick}
          />
        )}
      </div>
    </motion.div>
  );
}
