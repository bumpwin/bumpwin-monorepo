"use client";

import React from "react";
import CommunicationPanel from "../../components/CommunicationPanel";
import { ChampionsList } from "../../components/Champions";
import { mockChampionCoins } from "../../mock/mockChampions";
import mockDominanceData from "../../mock/mockDominanceData";

export default function ChampionsPage() {
  return (
    <div className="relative flex">
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
