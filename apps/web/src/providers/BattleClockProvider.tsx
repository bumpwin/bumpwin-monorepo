"use client";

import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

// Constants
const REFERENCE_DATE = new Date("2025-05-17T00:00:00Z").getTime();
const CYCLE_HOURS = 25;
const CHALLENGE_HOURS = 1;
const SECONDS_PER_HOUR = 60 * 60;
const CYCLE_DURATION_SEC = CYCLE_HOURS * SECONDS_PER_HOUR;
const CHALLENGE_DURATION_SEC = CHALLENGE_HOURS * SECONDS_PER_HOUR;
const CYCLE_DURATION_MS = CYCLE_DURATION_SEC * 1000;

// Types
type Phase = "daytime" | "darknight";

interface BattleClockContextType {
  isChallengePeriod: boolean;
  remainingTime: number;
  totalTime: number;
  challengeTime: number;
  currentRound: number;
  setIsChallengePeriod: (value: boolean) => void;
  setRemainingTime: (value: number) => void;
  phase: Phase;
  advanceTime: (hours: number) => void;
  resetTime: () => void;
  skipToDarkNight: () => void;
  skipToSunrise: () => void;
  resetDemoOffset: () => void;
}

interface TimeCalculationResult {
  currentRound: number;
  isChallengePeriod: boolean;
  remainingTime: number;
  phase: Phase;
}

// Utility functions
const calculateTimeAndRound = (
  now: number,
  timeOffset: number,
  demoOffset: number,
): TimeCalculationResult => {
  const adjustedNow = now + timeOffset + demoOffset;
  const timeSinceReference = adjustedNow - REFERENCE_DATE;
  const completedCycles = Math.floor(timeSinceReference / CYCLE_DURATION_MS);
  const currentRoundNumber = completedCycles + 1;
  const timeInCurrentCycle = timeSinceReference % CYCLE_DURATION_MS;
  const challengePeriodDuration = CHALLENGE_DURATION_SEC * 1000;
  const isInChallengePeriod = timeInCurrentCycle < challengePeriodDuration;

  let remaining: number;
  if (isInChallengePeriod) {
    remaining = Math.floor((challengePeriodDuration - timeInCurrentCycle) / 1000);
  } else {
    const nextCycleStart = REFERENCE_DATE + (completedCycles + 1) * CYCLE_DURATION_MS;
    remaining = Math.floor((nextCycleStart - adjustedNow) / 1000);
  }

  const isDarknight = timeInCurrentCycle >= CYCLE_DURATION_MS - challengePeriodDuration;

  return {
    currentRound: currentRoundNumber,
    isChallengePeriod: isInChallengePeriod,
    remainingTime: remaining,
    phase: isDarknight ? "darknight" : "daytime",
  };
};

const BattleClockContext = createContext<BattleClockContextType | undefined>(undefined);

export function BattleClockProvider({ children }: { children: ReactNode }) {
  const totalTime = CYCLE_DURATION_SEC;
  const challengeTime = CHALLENGE_DURATION_SEC;
  const [isChallengePeriod, setIsChallengePeriod] = useState(false);
  const [remainingTime, setRemainingTime] = useState(totalTime);
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("daytime");
  const [timeOffset, setTimeOffset] = useState(0);
  const [demoOffset, setDemoOffset] = useState(0);

  const updateTimeAndRound = useCallback(() => {
    const result = calculateTimeAndRound(new Date().getTime(), timeOffset, demoOffset);
    setCurrentRound(result.currentRound);
    setIsChallengePeriod(result.isChallengePeriod);
    setRemainingTime(result.remainingTime);
    setPhase(result.phase);
  }, [timeOffset, demoOffset]);

  useEffect(() => {
    updateTimeAndRound();
    const intervalId = setInterval(updateTimeAndRound, 1000);
    return () => clearInterval(intervalId);
  }, [updateTimeAndRound]);

  const advanceTime = useCallback((hours: number) => {
    setTimeOffset((prev) => prev + hours * SECONDS_PER_HOUR * 1000);
  }, []);

  const resetTime = useCallback(() => {
    setTimeOffset(0);
  }, []);

  const skipToDarkNight = useCallback(() => {
    const now = new Date().getTime() + timeOffset;
    const timeSinceReference = now - REFERENCE_DATE;
    const completedCycles = Math.floor(timeSinceReference / CYCLE_DURATION_MS);
    const nextDarknightStart =
      REFERENCE_DATE +
      (completedCycles + 1) * CYCLE_DURATION_MS -
      CHALLENGE_DURATION_SEC * 1000 -
      5000;
    const requiredDemoOffset = nextDarknightStart - (new Date().getTime() + timeOffset);
    setDemoOffset(requiredDemoOffset);
  }, [timeOffset]);

  const resetDemoOffset = useCallback(() => {
    setDemoOffset(0);
  }, []);

  const skipToSunrise = useCallback(() => {
    const now = new Date().getTime() + timeOffset;
    const timeSinceReference = now - REFERENCE_DATE;
    const completedCycles = Math.floor(timeSinceReference / CYCLE_DURATION_MS);
    const nextSunriseStart = REFERENCE_DATE + (completedCycles + 1) * CYCLE_DURATION_MS - 5000; // 5 seconds before daytime
    const requiredDemoOffset = nextSunriseStart - (new Date().getTime() + timeOffset);
    setDemoOffset(requiredDemoOffset);
  }, [timeOffset]);

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
        skipToSunrise,
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
