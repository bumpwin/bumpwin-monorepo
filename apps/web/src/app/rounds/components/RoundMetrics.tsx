import type { RoundMetrics as RoundMetricsType } from "@/app/rounds/types";
import { motion } from "framer-motion";

interface RoundMetricsProps {
  metrics: RoundMetricsType;
  index: number;
}

export function RoundMetrics({ metrics, index }: RoundMetricsProps) {
  return (
    <>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.2 }}
        className="flex flex-col items-center rounded-lg border border-gray-700/50 bg-black/40 px-4 py-3 backdrop-blur-sm"
      >
        <span className="text-gray-400 text-sm">Market Cap</span>
        <span className="font-bold text-white text-xl">{metrics.mcap}</span>
      </motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
        className="flex flex-col items-center rounded-lg border border-gray-700/50 bg-black/40 px-4 py-3 backdrop-blur-sm"
      >
        <span className="text-gray-400 text-sm">Volume</span>
        <span className="font-bold text-white text-xl">{metrics.volume}</span>
      </motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.4 }}
        className="flex flex-col items-center rounded-lg border border-gray-700/50 bg-black/40 px-4 py-3 backdrop-blur-sm"
      >
        <span className="text-gray-400 text-sm">Meme Count</span>
        <span className="font-bold text-white text-xl">{metrics.memes}</span>
      </motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.5 }}
        className="flex flex-col items-center rounded-lg border border-gray-700/50 bg-black/40 px-4 py-3 backdrop-blur-sm"
      >
        <span className="text-gray-400 text-sm">Trader Count</span>
        <span className="font-bold text-white text-xl">{metrics.traders}</span>
      </motion.div>
    </>
  );
}
