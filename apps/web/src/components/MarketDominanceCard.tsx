import DominanceChartSection from "@/components/DominanceChartSection";
import { Card, CardContent, CardHeader } from "@workspace/shadcn/components/card";

const formatRemainingTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

interface MarketDominanceCardProps {
  remainingTime: number;
}

export const MarketDominanceCard = ({ remainingTime }: MarketDominanceCardProps) => {
  return (
    <Card className="w-full border-none bg-black/20 backdrop-blur-sm">
      <CardHeader className="relative px-4">
        <div className="z-20 flex items-center justify-between">
          <h2 className="font-bold text-lg text-white tracking-tight">Market Dominance</h2>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" />
            <span className="font-medium text-white text-xs">LIVE</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-0 pb-2">
        <DominanceChartSection />
      </CardContent>

      <CardContent className="relative z-20 px-6 pt-1">
        <div className="absolute top-0 right-6 left-6 h-[0.5px] overflow-hidden rounded-full bg-gradient-to-r from-yellow-400 to-purple-600 opacity-30" />

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="group relative flex flex-col gap-2 border-white/20 pt-1 pb-4 sm:border-r sm:py-2 sm:pr-4">
            <div className="flex items-center gap-1">
              <span className="text-2xl">🌞</span>
              <div className="rounded-full bg-yellow-300 px-2.5 py-1 font-semibold text-black text-sm shadow-sm">
                Daytime
              </div>
              <span className="font-medium text-sm text-yellow-100">(0-24h)</span>
            </div>
            <p className="max-w-xl font-medium text-gray-200 text-sm leading-relaxed">
              A decision market culls the meme swarm into the Finalist 8. Time left:
              <span className="ml-2 font-bold text-orange-500">
                {formatRemainingTime(remainingTime)}
              </span>
            </p>
          </div>

          <div className="group relative flex flex-col gap-2 pt-4 pb-1 sm:py-2 sm:pl-2">
            <div className="flex items-center gap-1">
              <span className="text-2xl">🌑</span>
              <div className="rounded-full bg-purple-600 px-2.5 py-1 font-semibold text-sm text-white shadow-sm">
                Darknight
              </div>
              <span className="font-medium text-purple-100 text-sm">(24-25h)</span>
            </div>
            <p className="max-w-xl font-medium text-gray-200 text-sm leading-relaxed">
              Then comes the kill round: five sealed auctions, 12 minutes each—trader positions are
              hidden, only one meme survives.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
