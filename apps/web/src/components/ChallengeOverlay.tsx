"use client";
import { useBattleClock } from "@/app/providers/BattleClockProvider";
import { useEffect, useState } from "react";

export function ChallengeOverlay() {
  const { isChallengePeriod } = useBattleClock();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isChallengePeriod) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const interval = setInterval(() => {
      setVisible((v) => !v);
    }, 800); // 0.8秒ごとにトグル
    return () => clearInterval(interval);
  }, [isChallengePeriod]);

  if (!isChallengePeriod) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(255,0,0,0.3)",
        pointerEvents: "none",
        opacity: visible ? 1 : 0.2,
        transition: "opacity 0.15s",
      }}
    />
  );
}
