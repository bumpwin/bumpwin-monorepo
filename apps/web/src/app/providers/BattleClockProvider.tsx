"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface BattleClockContextType {
  isChallengePeriod: boolean;
  remainingTime: number;
  totalTime: number;
  challengeTime: number;
  currentRound: number;
  setIsChallengePeriod: (value: boolean) => void;
  setRemainingTime: (value: number) => void;
}

const BattleClockContext = createContext<BattleClockContextType | undefined>(
  undefined,
);

// 基準時刻: 2025-05-17T00:00:00Z
const REFERENCE_DATE = new Date("2025-05-17T00:00:00Z").getTime();
const CYCLE_HOURS = 25;
const CHALLENGE_HOURS = 1;
const SECONDS_PER_HOUR = 60 * 60;
const CYCLE_DURATION_SEC = CYCLE_HOURS * SECONDS_PER_HOUR;
const CHALLENGE_DURATION_SEC = CHALLENGE_HOURS * SECONDS_PER_HOUR;
const CYCLE_DURATION_MS = CYCLE_DURATION_SEC * 1000; // ミリ秒単位

export function BattleClockProvider({ children }: { children: ReactNode }) {
  const totalTime = CYCLE_DURATION_SEC; // 25時間（秒）
  const challengeTime = CHALLENGE_DURATION_SEC; // 1時間（秒）
  const [isChallengePeriod, setIsChallengePeriod] = useState(false);
  const [remainingTime, setRemainingTime] = useState(totalTime);
  const [currentRound, setCurrentRound] = useState(0);

  useEffect(() => {
    const calculateTimeAndRound = () => {
      const now = new Date().getTime();
      const timeSinceReference = now - REFERENCE_DATE;

      // 基準時刻からの経過周期数（Round）を計算
      const completedCycles = Math.floor(
        timeSinceReference / CYCLE_DURATION_MS,
      );
      const currentRoundNumber = completedCycles + 1; // 1から始まるRound番号

      // 現在の周期内での経過時間
      const timeInCurrentCycle = timeSinceReference % CYCLE_DURATION_MS;

      // チャレンジ期間かどうかを判定
      const challengePeriodDuration = challengeTime * 1000; // ミリ秒に変換
      const isInChallengePeriod = timeInCurrentCycle < challengePeriodDuration;

      // 残り時間の計算
      let remaining;
      if (isInChallengePeriod) {
        remaining = Math.floor(
          (challengePeriodDuration - timeInCurrentCycle) / 1000,
        );
      } else {
        const nextCycleStart =
          REFERENCE_DATE + (completedCycles + 1) * CYCLE_DURATION_MS;
        remaining = Math.floor((nextCycleStart - now) / 1000);
      }

      setCurrentRound(currentRoundNumber);
      setIsChallengePeriod(isInChallengePeriod);
      setRemainingTime(remaining);
    };

    // 初回計算
    calculateTimeAndRound();

    // 1秒ごとに更新
    const intervalId = setInterval(calculateTimeAndRound, 1000);

    return () => clearInterval(intervalId);
  }, [challengeTime]);

  return (
    <BattleClockContext.Provider
      value={{
        isChallengePeriod,
        remainingTime,
        totalTime,
        challengeTime,
        currentRound,
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
