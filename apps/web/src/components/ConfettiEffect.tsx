"use client";

import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import { useBattleClock } from "@/app/providers/BattleClockProvider";

export function ConfettiEffect() {
  const [confettiKey, setConfettiKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { remainingTime, totalTime } = useBattleClock();
  const prevTimeRef = useRef<number | null>(null);
  const cycleRef = useRef<number>(0);
  const lastTriggeredCycleRef = useRef<number>(-1);

  useEffect(() => {
    function updateSize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (prevTimeRef.current === null) {
      prevTimeRef.current = remainingTime;
      return;
    }

    if (remainingTime === totalTime && prevTimeRef.current !== totalTime) {
      cycleRef.current += 1;
      prevTimeRef.current = remainingTime;
      return;
    }

    if (
      remainingTime === 0 &&
      prevTimeRef.current !== 0 &&
      lastTriggeredCycleRef.current !== cycleRef.current
    ) {
      lastTriggeredCycleRef.current = cycleRef.current;
      setConfettiKey((prev) => prev + 1);
      setShowConfetti(true);
    }

    prevTimeRef.current = remainingTime;
  }, [remainingTime, totalTime]);

  if (!showConfetti || dimensions.width === 0) {
    return null;
  }

  return (
    <div
      key={confettiKey}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={1500}
        recycle={false}
        gravity={0.2}
        initialVelocityY={15}
        tweenDuration={7000}
        colors={["#FFD700", "#FFA500", "#FF69B4", "#FF4500", "#9370DB"]}
      />
    </div>
  );
}
