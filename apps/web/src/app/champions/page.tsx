"use client";

import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import Link from "next/link";
import { ChampionCoinCard } from "../../components/ChampionCoinCard";
import CommunicationPanel from "../../components/CommunicationPanel";
import { mockChampionCoins } from "../../mock/mockChampionCoins";

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
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Champions</h1>
            <Link href="/coins" className="text-blue-500 hover:underline">
              View All Coins
            </Link>
          </div>
          <div className="grid gap-4">
            {mockChampionCoins.map((coin) => (
              <ChampionCoinCard key={coin.address} {...coin} />
            ))}
          </div>
        </div>
      </div>
      <CommunicationPanel />
    </div>
  );
}
