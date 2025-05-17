"use client";

import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import CommunicationPanel from "../../components/CommunicationPanel";
import { ChampionsList } from "../../components/Champions";
import { mockChampionCoins } from "../../mock/mockChampions";
import mockDominanceData from "../../mock/mockDominanceData";

export default function ChampionsPage() {
  const [showConfetti, setShowConfetti] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
    const timer1 = setTimeout(() => setFadeOut(true), 3500);
    const timer2 = setTimeout(() => setShowConfetti(false), 4500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative flex">
      {/* 紙吹雪アニメーション */}
      {showConfetti && dimensions.width > 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1000,
            transition: "opacity 1s",
            opacity: showConfetti ? 1 : 0,
          }}
          className={fadeOut ? "opacity-0" : "opacity-100"}
        >
          <Confetti
            width={dimensions.width}
            height={dimensions.height}
            numberOfPieces={1200}
            recycle={false}
          />
        </div>
      )}
      <div className="flex-1 h-[calc(100vh-4rem)] overflow-auto">
        <div className="flex flex-col gap-6 p-4">
          {/* シンプルなタイトルセクション */}
          <div className="flex flex-col items-center justify-center py-6">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500">
              CHAMPIONS
            </h1>
            <div className="mt-2 text-center text-gray-300">
              The greatest coins of all time
            </div>
          </div>
          <ChampionsList
            coins={mockChampionCoins}
            dominanceData={mockDominanceData}
          />
        </div>
      </div>
      <CommunicationPanel />
    </div>
  );
}
