import { ActiveRoundCard } from "@/app/rounds/components/ActiveRoundCard";
import { RoundChart } from "@/app/rounds/components/RoundChart";
import { RoundCoins } from "@/app/rounds/components/RoundCoins";
import { RoundMetrics } from "@/app/rounds/components/RoundMetrics";
import { WaitingRoundCard } from "@/app/rounds/components/WaitingRoundCard";
import type { ChartCoin, ChartPoint, CoinMetadata, Round } from "@/app/rounds/types";
import { getSafeIcon, getSafeSymbol } from "@/app/rounds/utils";
import { ChampionCard } from "@/components/champions/ChampionCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface RoundCardProps {
  round: Round;
  index: number;
  chartPoints: ChartPoint[];
  chartCoins: ChartCoin[];
  mockCoinMetadata: CoinMetadata[];
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
        "relative overflow-hidden rounded-2xl border p-6 shadow-2xl backdrop-blur-sm",
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
          round.state === "active" ? "animate-pulse bg-purple-500" : "bg-gray-700",
        )}
      />

      <div className="flex flex-col">
        {/* Header with round number, status, and date */}
        <div className="mb-4 flex items-center justify-between">
          <div
            className={cn(
              "font-black text-6xl",
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
                  "mb-0 font-extrabold text-3xl tracking-tight",
                  round.state === "active" ? "text-purple-300" : "text-white",
                )}
              >
                {round.status}
                {round.state === "active" && (
                  <span className="ml-3 inline-flex animate-pulse items-center rounded-full bg-purple-500/20 px-2.5 py-0.5 font-medium text-purple-300 text-xs">
                    ● LIVE
                  </span>
                )}
              </div>
            </div>

            <div className="ml-6 font-medium text-base text-gray-200">
              <span>Start: {round.startTime}</span>
              <span className="mx-2 text-gray-500">•</span>
              <span>End: {round.endTime}</span>
            </div>
          </div>
        </div>

        {round.state !== "waiting" ? (
          <div className="flex items-start">
            {/* Left column */}
            <div className="flex flex-1 flex-col gap-4 pr-6">
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
                    imageUrl={getSafeIcon(mockCoinMetadata, round.round % mockCoinMetadata.length)}
                    symbol={getSafeSymbol(mockCoinMetadata, round.round % mockCoinMetadata.length)}
                    name={`Round ${round.round} Winner`}
                    mcap={Number(round.metrics.mcap)}
                    round={round.round}
                  />
                )}
                {round.state === "active" && <ActiveRoundCard endTime={round.endTime} />}
              </div>
            )}
          </div>
        ) : (
          <WaitingRoundCard startTime={round.startTime} onCreateClick={onCreateClick} />
        )}
      </div>
    </motion.div>
  );
}
