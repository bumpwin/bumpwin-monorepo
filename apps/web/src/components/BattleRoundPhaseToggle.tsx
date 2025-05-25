"use client";

import { useBattleClock } from "@/providers/BattleClockProvider";
import { useEffect, useState } from "react";

export const BattleRoundPhaseToggle = () => {
  const { phase, skipToDarkNight, resetDemoOffset } = useBattleClock();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isButtonDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isButtonDisabled, countdown]);

  const handleSkipToDaytime = () => {
    resetDemoOffset();
    setIsButtonDisabled(true);
    setCountdown(7);
    setTimeout(() => {
      setIsButtonDisabled(false);
      setCountdown(0);
    }, 7000);
  };

  const handleSkipToDarknight = () => {
    skipToDarkNight();
    setIsButtonDisabled(true);
    setCountdown(7);
    setTimeout(() => {
      setIsButtonDisabled(false);
      setCountdown(0);
    }, 7000);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-4">
        <button
          type="button"
          onClick={
            phase === "daytime" ? handleSkipToDarknight : handleSkipToDaytime
          }
          disabled={isButtonDisabled}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 border-2 ${
            isButtonDisabled
              ? "bg-black/20 border-gray-500 cursor-not-allowed scale-95"
              : "bg-black/40 hover:bg-black/60 border-red-500 hover:scale-105"
          }`}
        >
          <span className="text-sm font-medium text-white">
            {isButtonDisabled ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">⏳</span>
                {countdown}s until next skip
              </span>
            ) : (
              `skip to ${phase === "daytime" ? "Darknight" : "Daytime"} for demo`
            )}
          </span>
        </button>
      </div>
      <div className="flex items-center justify-center gap-4 mb-4">
        <div
          className={`flex items-center gap-1 transition-opacity duration-300 ${
            phase === "darknight" ? "opacity-50" : ""
          }`}
        >
          <span className="text-2xl">🌞</span>
          <div className="px-2.5 py-1 text-black font-semibold text-sm bg-yellow-300 rounded-full shadow-sm">
            Daytime
          </div>
        </div>
        <div
          className={`flex items-center gap-1 transition-opacity duration-300 ${
            phase === "daytime" ? "opacity-50" : ""
          }`}
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
