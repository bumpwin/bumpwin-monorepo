import React from "react";
import { Clock, Shield } from "lucide-react";

interface ActiveRoundCardProps {
  endTime: string;
}

export function ActiveRoundCard({ endTime }: ActiveRoundCardProps) {
  return (
    <div className="w-[320px] h-full">
      <div className="relative h-full w-full rounded-xl shadow-2xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.25)] bg-black/70 overflow-hidden">
        <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-1 px-3 rounded-lg text-xs uppercase tracking-wider flex items-center shadow-lg z-20">
          <Clock className="w-3 h-3 mr-1" />
          IN PROGRESS
        </div>

        <div className="flex flex-col items-center justify-center h-full pb-12 bg-black/70 backdrop-blur-sm px-4">
          <div className="w-20 h-20 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center mb-4 animate-pulse">
            <Shield className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-1 text-center">
            Champion Not Yet Determined
          </h3>
          <p className="text-gray-400 text-center max-w-xs mb-4 px-2">
            Battle in progress! The champion will be determined at the end of
            this round.
          </p>
          <button className="px-6 py-2 rounded-lg bg-purple-800 hover:bg-purple-700 text-white font-bold border border-purple-500/50 transition-all hover:scale-105 shadow-lg">
            Join The Battle
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm px-3 py-2">
          <div className="text-center text-sm font-bold text-white animate-pulse">
            Battle Ends: {endTime}
          </div>
        </div>
      </div>
    </div>
  );
}
