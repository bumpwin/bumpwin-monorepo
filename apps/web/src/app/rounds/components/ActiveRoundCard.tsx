import { Clock, Shield } from "lucide-react";
import Link from "next/link";

interface ActiveRoundCardProps {
  endTime: string;
}

export function ActiveRoundCard({ endTime }: ActiveRoundCardProps) {
  return (
    <div className="h-full w-[320px]">
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-purple-500/30 bg-black/70 shadow-2xl shadow-[0_0_20px_rgba(168,85,247,0.25)]">
        <div className="absolute top-2 left-2 z-20 flex items-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-1 font-bold text-white text-xs uppercase tracking-wider shadow-lg">
          <Clock className="mr-1 h-3 w-3" />
          IN PROGRESS
        </div>

        <div className="flex h-full flex-col items-center justify-center bg-black/70 px-4 pb-12 backdrop-blur-sm">
          <div className="mb-4 flex h-20 w-20 animate-pulse items-center justify-center rounded-full border border-purple-500/30 bg-purple-900/40">
            <Shield className="h-12 w-12 text-purple-400" />
          </div>
          <h3 className="mb-1 text-center font-extrabold text-2xl text-white">
            Champion Not Yet Determined
          </h3>
          <p className="mb-4 max-w-xs px-2 text-center text-gray-400">
            Battle in progress! The champion will be determined at the end of this round.
          </p>
          <Link
            href="/battle"
            className="rounded-lg border border-purple-500/50 bg-purple-800 px-6 py-2 text-center font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-purple-700"
          >
            Join The Battle
          </Link>
        </div>

        <div className="absolute right-0 bottom-0 left-0 bg-black/80 px-3 py-2 backdrop-blur-sm">
          <div className="animate-pulse text-center font-bold text-sm text-white">
            Battle Ends: {endTime}
          </div>
        </div>
      </div>
    </div>
  );
}
