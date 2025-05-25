"use client";

import { useBattleRoundPhase } from "@/providers/BattleRoundPhaseProvider";

export const BattleRoundPhaseToggle = () => {
  const { phase, setPhase } = useBattleRoundPhase();

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-4">
        <button
          type="button"
          onClick={() =>
            setPhase(phase === "daytime" ? "darknight" : "daytime")
          }
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors border-2 border-red-500"
        >
          <span className="text-sm font-medium text-white">
            skip to {phase === "daytime" ? "Darknight" : "Daytime"} for demo
          </span>
        </button>
      </div>
      <div className="flex items-center justify-center gap-4 mb-4">
        <div
          className={`flex items-center gap-1 ${phase === "darknight" ? "opacity-50" : ""}`}
        >
          <span className="text-2xl">🌞</span>
          <div className="px-2.5 py-1 text-black font-semibold text-sm bg-yellow-300 rounded-full shadow-sm">
            Daytime
          </div>
        </div>
        <div
          className={`flex items-center gap-1 ${phase === "daytime" ? "opacity-50" : ""}`}
        >
          <span className="text-2xl">🌑</span>
          <div className="px-2.5 py-1 text-white font-semibold text-sm bg-purple-600 rounded-full shadow-sm">
            DarkNight
          </div>
        </div>
      </div>
    </div>
  );
};
