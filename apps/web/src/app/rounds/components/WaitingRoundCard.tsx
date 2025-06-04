import { Plus } from "lucide-react";

interface WaitingRoundCardProps {
  startTime: string;
  onCreateClick: () => void;
}

export function WaitingRoundCard({ startTime, onCreateClick }: WaitingRoundCardProps) {
  return (
    <div className="flex flex-row items-center gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-purple-500/30 bg-purple-900/40">
            <Plus className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xl">Be the first to create a meme coin!</h3>
            <p className="text-gray-400">Upcoming round starts on {startTime}</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onCreateClick}
        className="rounded-lg border border-purple-500/50 bg-purple-800 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-purple-700"
      >
        Create Your Meme Coin
      </button>
    </div>
  );
}
