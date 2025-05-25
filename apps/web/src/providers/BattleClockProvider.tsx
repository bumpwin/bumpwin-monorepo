"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
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
  phase: "daytime" | "darknight";
  advanceTime: (hours: number) => void;
  resetTime: () => void;
  skipToDarkNight: () => void;
  resetDemoOffset: () => void;
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
  const [phase, setPhase] = useState<"daytime" | "darknight">("daytime");
  const [timeOffset, setTimeOffset] = useState(0);
  const [demoOffset, setDemoOffset] = useState(0);

  const calculateTimeAndRound = useCallback(() => {
    const now = new Date().getTime() + timeOffset + demoOffset; // 両方のオフセットを加算
    const timeSinceReference = now - REFERENCE_DATE;

    // 基準時刻からの経過周期数（Round）を計算
    const completedCycles = Math.floor(timeSinceReference / CYCLE_DURATION_MS);
    const currentRoundNumber = completedCycles + 1;

    // 現在の周期内での経過時間
    const timeInCurrentCycle = timeSinceReference % CYCLE_DURATION_MS;

    // チャレンジ期間かどうかを判定
    const challengePeriodDuration = challengeTime * 1000;
    const isInChallengePeriod = timeInCurrentCycle < challengePeriodDuration;

    // 残り時間の計算
    let remaining: number;
    if (isInChallengePeriod) {
      remaining = Math.floor(
        (challengePeriodDuration - timeInCurrentCycle) / 1000,
      );
    } else {
      const nextCycleStart =
        REFERENCE_DATE + (completedCycles + 1) * CYCLE_DURATION_MS;
      remaining = Math.floor((nextCycleStart - now) / 1000);
    }

    // フェーズの判定
    const isDarknight =
      timeInCurrentCycle >= CYCLE_DURATION_MS - challengePeriodDuration;
    setPhase(isDarknight ? "darknight" : "daytime");

    setCurrentRound(currentRoundNumber);
    setIsChallengePeriod(isInChallengePeriod);
    setRemainingTime(remaining);
  }, [challengeTime, timeOffset, demoOffset]);

  useEffect(() => {
    // 初回計算
    calculateTimeAndRound();

    // 1秒ごとに更新
    const intervalId = setInterval(calculateTimeAndRound, 1000);

    return () => clearInterval(intervalId);
  }, [calculateTimeAndRound]);

  // 時間を進める関数（通常の時間操作用）
  const advanceTime = useCallback((hours: number) => {
    setTimeOffset((prev) => prev + hours * 60 * 60 * 1000);
  }, []);

  // 時間をリセットする関数（通常の時間操作用）
  const resetTime = useCallback(() => {
    setTimeOffset(0);
  }, []);

  // darknightの開始5秒前にスキップする関数（デモ用）
  const skipToDarkNight = useCallback(() => {
    const now = new Date().getTime() + timeOffset;
    const timeSinceReference = now - REFERENCE_DATE;
    const completedCycles = Math.floor(timeSinceReference / CYCLE_DURATION_MS);

    // 次のdarknight開始時刻を計算（現在の周期の終了5秒前）
    const nextDarknightStart =
      REFERENCE_DATE +
      (completedCycles + 1) * CYCLE_DURATION_MS -
      challengeTime * 1000 -
      5000;

    // 必要なデモオフセットを計算
    const requiredDemoOffset =
      nextDarknightStart - (new Date().getTime() + timeOffset);
    setDemoOffset(requiredDemoOffset);
  }, [challengeTime, timeOffset]);

  // デモオフセットをリセットする関数
  const resetDemoOffset = useCallback(() => {
    setDemoOffset(0);
  }, []);

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
        phase,
        advanceTime,
        resetTime,
        skipToDarkNight,
        resetDemoOffset,
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
