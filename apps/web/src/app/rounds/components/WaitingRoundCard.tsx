import React from "react";
import { Plus } from "lucide-react";

interface WaitingRoundCardProps {
  startTime: string;
  onCreateClick: () => void;
}

export function WaitingRoundCard({
  startTime,
  onCreateClick,
}: WaitingRoundCardProps) {
  return (
    <div className="flex flex-row items-center gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center">
            <Plus className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Be the first to create a meme coin!
            </h3>
            <p className="text-gray-400">
              Upcoming round starts on {startTime}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={onCreateClick}
        className="px-6 py-3 rounded-lg bg-purple-800 hover:bg-purple-700 text-white font-bold border border-purple-500/50 transition-all hover:scale-105 shadow-lg"
      >
        Create Your Meme Coin
      </button>
    </div>
  );
}
