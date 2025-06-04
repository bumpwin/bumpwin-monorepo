"use client";

import { useBattleClock } from "@/providers/BattleClockProvider";
import { useEffect, useState } from "react";

export const BattleRoundPhaseToggle = () => {
  const { phase, skipToDarkNight, skipToSunrise } = useBattleClock();
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

  const handleSkipToSunrise = () => {
    skipToSunrise();
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
      <div className="mb-4 flex items-center justify-center">
        <button
          type="button"
          onClick={phase === "daytime" ? handleSkipToDarknight : handleSkipToSunrise}
          disabled={isButtonDisabled}
          className={`flex items-center gap-1 rounded-full border-2 px-3 py-1.5 transition-all duration-300 ${
            isButtonDisabled
              ? "scale-95 cursor-not-allowed border-gray-500 bg-black/20"
              : "border-red-500 bg-black/40 hover:scale-105 hover:bg-black/60"
          }`}
        >
          <span className="font-medium text-sm text-white">
            {isButtonDisabled ? (
              <span className="flex items-center gap-2">
                <span className="animate-pulse">⏳</span>
                {countdown}s until next skip
              </span>
            ) : (
              `skip to ${phase === "daytime" ? "Darknight" : "Sunrise"} for demo`
            )}
          </span>
        </button>
      </div>
      <div className="mb-4 flex items-center justify-center gap-4">
        <div
          className={`flex items-center gap-1 transition-opacity duration-300 ${
            phase === "darknight" ? "opacity-50" : ""
          }`}
        >
          <span className="text-2xl">🌞</span>
          <div className="rounded-full bg-yellow-300 px-2.5 py-1 font-semibold text-black text-sm shadow-sm">
            Daytime
          </div>
        </div>
        <div
          className={`flex items-center gap-1 transition-opacity duration-300 ${
            phase === "daytime" ? "opacity-50" : ""
          }`}
        >
          <span className="text-2xl">🌑</span>
          <div className="rounded-full bg-purple-600 px-2.5 py-1 font-semibold text-sm text-white shadow-sm">
            DarkNight
          </div>
        </div>
      </div>
    </div>
  );
};
