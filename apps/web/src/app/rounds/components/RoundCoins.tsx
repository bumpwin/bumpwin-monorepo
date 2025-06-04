import type { CoinMetadata } from "@/app/rounds/types";
import { motion } from "framer-motion";
import Image from "next/image";

interface RoundCoinsProps {
  coins: CoinMetadata[];
}

export function RoundCoins({ coins }: RoundCoinsProps) {
  if (!coins || coins.length < 4) return null;

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {coins.slice(0, 4).map((coin, j) => {
        if (!coin || !coin.icon) return null;

        return (
          <motion.div
            key={coin.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: j * 0.1 }}
            className="flex items-center gap-2 rounded-lg border border-gray-700/50 bg-black/30 p-2 backdrop-blur-sm transition-colors hover:bg-black/40"
          >
            <Image
              src={coin.icon}
              alt={coin.symbol}
              width={28}
              height={28}
              className="rounded-full"
            />
            <div>
              <div className="font-bold text-white">{coin.symbol}</div>
              <div className="text-gray-400 text-xs">
                {j === 0 ? "32%" : j === 1 ? "28%" : j === 2 ? "22%" : "18%"} share
              </div>
            </div>
            <div className="ml-auto">
              <span
                className={
                  j === 0
                    ? "text-green-400"
                    : j === 1
                      ? "text-green-300"
                      : j === 2
                        ? "text-red-300"
                        : "text-red-400"
                }
              >
                {j === 0 ? "+2.4%" : j === 1 ? "+1.2%" : j === 2 ? "-0.8%" : "-1.5%"}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
