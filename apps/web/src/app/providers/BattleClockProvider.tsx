"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BattleClockContextType {
  isChallengePeriod: boolean;
  remainingTime: number;
  totalTime: number;
  challengeTime: number;
  setIsChallengePeriod: (value: boolean) => void;
  setRemainingTime: (value: number) => void;
}

const BattleClockContext = createContext<BattleClockContextType | undefined>(
  undefined,
);

export function BattleClockProvider({ children }: { children: ReactNode }) {
  const totalTime = 15; // カウントダウンの合計時間（秒）
  const challengeTime = 5; // チャレンジ期間の時間（秒）
  const [isChallengePeriod, setIsChallengePeriod] = useState(false);
  const [remainingTime, setRemainingTime] = useState(totalTime);

  return (
    <BattleClockContext.Provider
      value={{
        isChallengePeriod,
        remainingTime,
        totalTime,
        challengeTime,
        setIsChallengePeriod,
        setRemainingTime,
      }}
    >
      {children}
    </BattleClockContext.Provider>
  );
}

export function useBattleClock() {
  const context = useContext(BattleClockContext);
  if (context === undefined) {
    throw new Error("useBattleClock must be used within a BattleClockProvider");
  }
  return context;
}
