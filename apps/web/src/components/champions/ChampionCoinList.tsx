"use client";

import { getChampions } from "@workspace/mockdata";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export const ChampionCoinList = () => {
  const champions = getChampions();

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2
            className="relative bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500 bg-clip-text font-extrabold text-2xl text-transparent drop-shadow-[0_2px_12px_rgba(255,255,180,0.35)] md:text-3xl"
            style={{ WebkitTextStroke: "1px #fff9", letterSpacing: "0.02em" }}
          >
            Previous Champions <span className="align-middle">🏆</span>
            <span
              className="pointer-events-none absolute top-0 right-0 left-0 h-1/3 rounded-full bg-white/60 blur-md"
              style={{ zIndex: 1 }}
            />
          </h2>
        </div>
        <Link
          href="/champions"
          className="font-bold text-blue-400 text-lg drop-shadow transition-colors hover:text-blue-300"
        >
          View All Champions →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {champions.map((champion) => (
          <div key={champion.meme?.id} className="relative">
            <Link href={`/champions/${champion.round.round}`} className="group block" tabIndex={0}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="cursor-pointer rounded-2xl border border-[#23262F] bg-[#181A20] p-6 transition-colors hover:border-yellow-400 group-hover:shadow-lg group-active:scale-[0.98]"
              >
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="relative h-28 w-28">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-900 p-[4px] shadow-[0_0_24px_4px_rgba(255,215,0,0.25)]">
                        <div className="absolute inset-0 rounded-full bg-white p-[2px]">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-600 opacity-70" />
                          <div className="absolute inset-0 overflow-hidden rounded-full">
                            <Image
                              src={champion.meme?.iconUrl}
                              alt={champion.meme?.name}
                              width={112}
                              height={112}
                              className="h-full w-full rounded-full border-0 object-cover"
                            />
                            <div className="absolute top-2 left-2 h-1/4 w-2/3 rotate-[-20deg] rounded-full bg-white/60 blur-md" />
                          </div>
                        </div>
                      </div>
                      <div className="-top-3 -right-3 absolute flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 font-bold text-base text-black shadow-xl">
                        #{champion.round.round}
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="truncate font-bold text-lg text-white">
                        {champion.meme?.name}
                      </h3>
                      <span className="text-gray-400 text-sm">({champion.meme?.symbol})</span>
                    </div>
                    <p className="mb-4 line-clamp-2 text-gray-400 text-sm">
                      {champion.meme?.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
