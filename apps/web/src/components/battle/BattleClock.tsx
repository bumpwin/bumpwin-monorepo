"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Define the component props interface
interface BattleClockProps {
  totalSeconds: number;
  challengeSeconds: number;
  onChallengeStatusChange?: (isChallenge: boolean) => void;
}

// Helper function to format seconds to HH:MM:SS
const formatTime = (seconds: number): string => {
  let displaySeconds = seconds;
  if (displaySeconds < 0) displaySeconds = 0;

  // 25時間サイクルに対応するため、時間を2桁ではなく必要な桁数で表示
  const hours = Math.floor(displaySeconds / 3600);
  const minutes = Math.floor((displaySeconds % 3600) / 60);
  const secs = displaySeconds % 60;

  // 時間が10未満なら2桁で、それ以上なら必要な桁数で表示
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// 7セグメントLED風の数字コンポーネント
const SevenSegmentDisplay = ({
  value,
  isChallenge,
  toggle,
}: {
  value: string;
  isChallenge: boolean;
  toggle: boolean;
}) => {
  // セグメントの色を決定 - 通常時はオレンジ系、チャレンジ時は赤系
  const segmentColor = isChallenge
    ? toggle
      ? "#ff0000" // 明るい赤
      : "#cc0000" // 暗い赤
    : "#ff5e00"; // オレンジ

  const shadowColor = isChallenge
    ? "rgba(255, 0, 0, 0.8)" // 赤のシャドウ
    : "rgba(255, 94, 0, 0.8)"; // オレンジのシャドウ

  const inactiveOpacity = "opacity-12"; // 非アクティブセグメントの透明度

  // 7セグメント表示のセグメント活性状態マッピング
  const getSegmentActive = (char: string, segment: string): boolean => {
    const segmentMap: Record<string, string[]> = {
      top: ["0", "2", "3", "5", "6", "7", "8", "9"],
      topRight: ["0", "1", "2", "3", "4", "7", "8", "9"],
      bottomRight: ["0", "1", "3", "4", "5", "6", "7", "8", "9"],
      bottom: ["0", "2", "3", "5", "6", "8", "9"],
      bottomLeft: ["0", "2", "6", "8"],
      topLeft: ["0", "4", "5", "6", "8", "9"],
      middle: ["2", "3", "4", "5", "6", "8", "9"],
    };
    return segmentMap[segment]?.includes(char) ?? false;
  };

  return (
    <div className="flex origin-center scale-[0.7]">
      {value.split("").map((char, i) => (
        <div key={`char-${i}-${char}`} className="relative mx-0.5">
          {char === ":" ? (
            <div className="mx-1 flex h-full flex-col items-center justify-center">
              <div
                className="mb-4 h-3 w-3 rounded-full"
                style={{
                  backgroundColor: segmentColor,
                  boxShadow: `0 0 12px ${shadowColor}`,
                }}
              />
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: segmentColor,
                  boxShadow: `0 0 12px ${shadowColor}`,
                }}
              />
            </div>
          ) : (
            <div
              className="relative h-24 w-14"
              style={{
                filter: `drop-shadow(0 0 8px ${shadowColor})`,
              }}
            >
              {/* 上部セグメント */}
              <div
                className={`absolute top-0 right-2 left-2 h-2.5 ${getSegmentActive(char, "top") ? "" : inactiveOpacity}`}
                style={{ backgroundColor: segmentColor }}
              />

              {/* 右上セグメント */}
              <div
                className={`absolute top-1 right-0 h-10 w-2.5 ${getSegmentActive(char, "topRight") ? "" : inactiveOpacity}`}
                style={{ backgroundColor: segmentColor }}
              />

              {/* 右下セグメント */}
              <div
                className={`absolute right-0 bottom-1 h-10 w-2.5 ${getSegmentActive(char, "bottomRight") ? "" : inactiveOpacity}`}
                style={{ backgroundColor: segmentColor }}
              />

              {/* 下部セグメント */}
              <div
                className={`absolute right-2 bottom-0 left-2 h-2.5 ${getSegmentActive(char, "bottom") ? "" : inactiveOpacity}`}
                style={{ backgroundColor: segmentColor }}
              />

              {/* 左下セグメント */}
              <div
                className={`absolute bottom-1 left-0 h-10 w-2.5 ${getSegmentActive(char, "bottomLeft") ? "" : inactiveOpacity}`}
                style={{ backgroundColor: segmentColor }}
              />

              {/* 左上セグメント */}
              <div
                className={`absolute top-1 left-0 h-10 w-2.5 ${getSegmentActive(char, "topLeft") ? "" : inactiveOpacity}`}
                style={{ backgroundColor: segmentColor }}
              />

              {/* 中央セグメント */}
              <div
                className={`absolute top-10 right-2 left-2 h-2.5 ${getSegmentActive(char, "middle") ? "" : inactiveOpacity}`}
                style={{ backgroundColor: segmentColor }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function BattleClock({
  totalSeconds,
  challengeSeconds,
  onChallengeStatusChange,
}: BattleClockProps) {
  // Toggle for flashing effect in challenge phase
  const [toggle, setToggle] = useState(false);

  // Determine current phase - totalSecondsがremainingTimeとして渡される
  const isChallenge = totalSeconds <= challengeSeconds;

  // 親コンポーネントにチャレンジステータスを通知
  useEffect(() => {
    onChallengeStatusChange?.(isChallenge);
  }, [isChallenge, onChallengeStatusChange]);

  // 残り時間のコールバックは不要（循環してしまう）
  // BattleClockProviderがすでに管理しているため削除

  // Effect for the flashing toggle in challenge phase
  useEffect(() => {
    if (!isChallenge) return;

    const flashTimer = setInterval(() => {
      setToggle((prev) => !prev);
    }, 300); // チャレンジ時はより早く点滅

    return () => clearInterval(flashTimer);
  }, [isChallenge]);

  return (
    <AnimatePresence>
      <motion.div
        className="relative flex h-20 w-full items-center justify-center overflow-hidden rounded-lg"
        animate={
          isChallenge
            ? {
                backgroundColor: toggle ? "rgba(40,0,0,0.3)" : "rgba(0,0,0,0)",
              }
            : {}
        }
        transition={{ duration: 0.3 }}
      >
        <div className="flex origin-center scale-[0.8] items-center justify-center">
          <SevenSegmentDisplay
            value={formatTime(totalSeconds)}
            isChallenge={isChallenge}
            toggle={toggle}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
