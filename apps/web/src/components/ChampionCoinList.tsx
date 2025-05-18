"use client";

import { mockChampionCoinMetadata } from "@/mock/mockData";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export const ChampionCoinList = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2
            className="text-2xl md:text-3xl font-extrabold bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(255,255,180,0.35)] relative"
            style={{ WebkitTextStroke: "1px #fff9", letterSpacing: "0.02em" }}
          >
            Previous Champions <span className="align-middle">🏆</span>
            <span
              className="absolute left-0 right-0 top-0 h-1/3 bg-white/60 rounded-full blur-md pointer-events-none"
              style={{ zIndex: 1 }}
            />
          </h2>
        </div>
        <Link
          href="/champions"
          className="text-blue-400 hover:text-blue-300 text-lg font-bold transition-colors drop-shadow"
        >
          View All Champions →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockChampionCoinMetadata.map((coin) => (
          <div key={coin.id} className="relative">
            <Link
              href={`/champions/${coin.round}`}
              className="block group"
              tabIndex={0}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#181A20] border border-[#23262F] rounded-2xl p-6 hover:border-yellow-400 transition-colors cursor-pointer group-hover:shadow-lg group-active:scale-[0.98]"
              >
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="relative w-28 h-28">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-900 p-[4px] shadow-[0_0_24px_4px_rgba(255,215,0,0.25)]">
                        <div className="absolute inset-0 rounded-full bg-white p-[2px]">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-300 to-yellow-600 opacity-70" />
                          <div className="absolute inset-0 rounded-full overflow-hidden">
                            <Image
                              src={coin.icon}
                              alt={coin.name}
                              width={112}
                              height={112}
                              className="rounded-full w-full h-full object-cover border-0"
                            />
                            <div className="absolute left-2 top-2 w-2/3 h-1/4 bg-white/60 rounded-full blur-md rotate-[-20deg]" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center text-base font-bold bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700 text-black shadow-xl border-2 border-white">
                        #{coin.round}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white truncate">
                        {coin.name}
                      </h3>
                      <span className="text-sm text-gray-400">
                        ({coin.symbol})
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {coin.description}
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
