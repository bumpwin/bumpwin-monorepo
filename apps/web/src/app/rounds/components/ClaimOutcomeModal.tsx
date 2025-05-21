import { useExecuteTransaction } from "@/hooks/transactions/useExecuteTransaction";
import { useTransactionCreators } from "@/hooks/transactions/useTransactionCreators";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MOCKCOINS_OBJECT_IDS } from "bumpwin";
import { mockcoins } from "bumpwin/suigen";
import { motion } from "framer-motion";
import React from "react";
import { toast } from "sonner";

interface ClaimOutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner?: {
    name: string;
    share: number;
  };
  roundId?: string;
}

export function ClaimOutcomeModal({
  isOpen,
  onClose,
  winner = { name: "SUP_DOGE", share: 42 },
  roundId = "#42",
}: ClaimOutcomeModalProps) {
  const currentAccount = useCurrentAccount();
  const { executeTransaction, isExecuting } = useExecuteTransaction();

  const handleClaim = async () => {
    if (!currentAccount) return;

    const tx = new Transaction();

    // Mint red token
    const redCoin = mockcoins.red.mint(tx, {
      treasuryCap: MOCKCOINS_OBJECT_IDS.TREASURY_CAPS.RED,
      u64: 100n * BigInt(1e9),
    });
    tx.transferObjects([redCoin], currentAccount.address);

    // Mint black token
    const blackCoin = mockcoins.black.mint(tx, {
      treasuryCap: MOCKCOINS_OBJECT_IDS.TREASURY_CAPS.BLACK,
      u64: 100n * BigInt(1e9),
    });
    tx.transferObjects([blackCoin], currentAccount.address);

    // Execute the combined transaction
    await executeTransaction(tx);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl rounded-2xl bg-gray-900 border border-yellow-500/50 shadow-[0_0_30px_rgba(255,215,0,0.3)] overflow-hidden z-50"
      >
        <div className="p-6">
          <h2 className="text-3xl font-extrabold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
            Claim Round Outcome
          </h2>

          <div className="text-center mb-6">
            <p className="text-gray-300 mb-2">Round {roundId} has completed!</p>
            <p className="text-gray-300">
              <span className="text-yellow-400 font-bold">{winner.name}</span>{" "}
              won with a {winner.share}% share.
            </p>
          </div>

          <div className="bg-black/40 p-5 rounded-xl border border-yellow-500/20 mb-6">
            <h3 className="text-xl font-bold text-white mb-3">You spent:</h3>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">SUI</span>
              <span className="text-white font-medium">160</span>
            </div>

            <h3 className="text-xl font-bold text-white mt-5 mb-3">
              You received:
            </h3>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-purple-300">SUP_DOGE (super doge)</span>
              <span className="text-white font-medium">3,200</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-blue-300">LOSER (BUMP.WIN Loser)</span>
              <span className="text-white font-medium">200</span>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg text-white bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleClaim}
              disabled={isExecuting}
              className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 transition-all hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExecuting ? "Claiming..." : "Claim Rewards"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
