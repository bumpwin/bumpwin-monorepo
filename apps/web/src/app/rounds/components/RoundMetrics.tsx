import type { RoundMetrics as RoundMetricsType } from "@/app/rounds/types";
import { motion } from "framer-motion";
import React from "react";

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
        className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 flex flex-col items-center"
      >
        <span className="text-gray-400 text-sm">Market Cap</span>
        <span className="text-white font-bold text-xl">{metrics.mcap}</span>
      </motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.3 }}
        className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 flex flex-col items-center"
      >
        <span className="text-gray-400 text-sm">Volume</span>
        <span className="text-white font-bold text-xl">{metrics.volume}</span>
      </motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.4 }}
        className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 flex flex-col items-center"
      >
        <span className="text-gray-400 text-sm">Meme Count</span>
        <span className="text-white font-bold text-xl">{metrics.memes}</span>
      </motion.div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.5 }}
        className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-lg px-4 py-3 flex flex-col items-center"
      >
        <span className="text-gray-400 text-sm">Trader Count</span>
        <span className="text-white font-bold text-xl">{metrics.traders}</span>
      </motion.div>
    </>
  );
}
