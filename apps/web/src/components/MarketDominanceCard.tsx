import DominanceChartSection from "@/components/DominanceChartSection";
import {
  Card,
  CardContent,
  CardHeader,
} from "@workspace/shadcn/components/card";

const formatRemainingTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

interface MarketDominanceCardProps {
  remainingTime: number;
}

export const MarketDominanceCard = ({
  remainingTime,
}: MarketDominanceCardProps) => {
  return (
    <Card className="w-full bg-black/20 backdrop-blur-sm border-none">
      <CardHeader className="relative px-4">
        <div className="flex items-center justify-between z-20">
          <h2 className="text-lg font-bold tracking-tight text-white">
            Market Dominance
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs text-white font-medium">LIVE</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-0 pb-2">
        <DominanceChartSection />
      </CardContent>

      <CardContent className="relative z-20 px-6 pt-1">
        <div className="absolute top-0 left-6 right-6 h-[0.5px] bg-gradient-to-r from-yellow-400 to-purple-600 opacity-30 rounded-full overflow-hidden" />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center pt-2">
          <div className="relative group flex flex-col gap-2 pb-4 pt-1 sm:py-2 sm:pr-4 sm:border-r border-white/20">
            <div className="flex items-center gap-1">
              <span className="text-2xl">🌞</span>
              <div className="px-2.5 py-1 text-black font-semibold text-sm bg-yellow-300 rounded-full shadow-sm">
                Daytime
              </div>
              <span className="text-sm text-yellow-100 font-medium">
                (0-24h)
              </span>
            </div>
            <p className="text-gray-200 text-sm max-w-xl leading-relaxed font-medium">
              A decision market culls the meme swarm into the Finalist 8. Time
              left:
              <span className="ml-2 font-bold text-orange-500">
                {formatRemainingTime(remainingTime)}
              </span>
            </p>
          </div>

          <div className="relative group flex flex-col gap-2 pt-4 pb-1 sm:py-2 sm:pl-2">
            <div className="flex items-center gap-1">
              <span className="text-2xl">🌑</span>
              <div className="px-2.5 py-1 text-white font-semibold text-sm bg-purple-600 rounded-full shadow-sm">
                Darknight
              </div>
              <span className="text-sm text-purple-100 font-medium">
                (24-25h)
              </span>
            </div>
            <p className="text-gray-200 text-sm max-w-xl leading-relaxed font-medium">
              Then comes the kill round: five sealed auctions, 12 minutes
              each—trader positions are hidden, only one meme survives.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
