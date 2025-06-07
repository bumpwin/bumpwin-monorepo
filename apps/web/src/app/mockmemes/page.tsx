"use client";

import { LoserCard } from "@/app/losers/LoserCard";
import { useMockmemes } from "@/hooks";

export default function MockmemesPage() {
  const { data: mockmemes = [], isLoading, error } = useMockmemes();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-10 text-center font-extrabold text-4xl text-white tracking-tight drop-shadow-lg">
            Mockmemes Gallery
          </h1>
          <div className="flex items-center justify-center py-20">
            <div className="text-white text-xl">Loading gallery...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-10 text-center font-extrabold text-4xl text-white tracking-tight drop-shadow-lg">
            Mockmemes Gallery
          </h1>
          <div className="flex items-center justify-center py-20">
            <div className="text-red-400 text-xl">Failed to load gallery</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-center font-extrabold text-4xl text-white tracking-tight drop-shadow-lg">
          Mockmemes Gallery
        </h1>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mockmemes.map((meme, i) => (
            <LoserCard
              key={meme.symbol}
              imageUrl={meme.iconUrl}
              title={meme.symbol}
              subtitle={meme.name}
              description={meme.description}
              price={"$0.000123"}
              mc={"$123,456"}
              rank={i + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
