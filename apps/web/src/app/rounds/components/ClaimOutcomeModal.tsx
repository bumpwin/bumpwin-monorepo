import { useExecuteTransaction } from "@/hooks/transactions/useExecuteTransaction";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MOCKCOINS_OBJECT_IDS } from "bumpwin";
import { mockcoins } from "bumpwin/suigen";
import { motion } from "framer-motion";
import { useState } from "react";

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
  const [txStatus, setTxStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleClaim = async () => {
    if (!currentAccount) return;

    try {
      setTxStatus("idle");
      setErrorMessage("");

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
      // Note: The success/error state will be handled by the toast notifications
      // and the isExecuting state from useExecuteTransaction
    } catch (error) {
      setTxStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Transaction failed");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 w-full max-w-xl transform overflow-hidden rounded-2xl border border-yellow-500/50 bg-gray-900 shadow-[0_0_30px_rgba(255,215,0,0.3)]"
      >
        <div className="p-6">
          <h2 className="mb-4 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-center font-extrabold text-3xl text-transparent">
            Claim Round Outcome
          </h2>

          <div className="mb-6 text-center">
            <p className="mb-2 text-gray-300">Round {roundId} has completed!</p>
            <p className="text-gray-300">
              <span className="font-bold text-yellow-400">{winner.name}</span> won with a{" "}
              {winner.share}% share.
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-yellow-500/20 bg-black/40 p-5">
            <h3 className="mb-3 font-bold text-white text-xl">You spent:</h3>
            <div className="flex items-center justify-between border-gray-700 border-b py-2">
              <span className="text-gray-300">SUI</span>
              <span className="font-medium text-white">160</span>
            </div>

            <h3 className="mt-5 mb-3 font-bold text-white text-xl">You received:</h3>
            <div className="flex items-center justify-between border-gray-700 border-b py-2">
              <span className="text-purple-300">SUP_DOGE (super doge)</span>
              <span className="font-medium text-white">3,200</span>
            </div>
            <div className="flex items-center justify-between border-gray-700 border-b py-2">
              <span className="text-blue-300">LOSER (BUMP.WIN Loser)</span>
              <span className="font-medium text-white">200</span>
            </div>
          </div>

          {isExecuting && (
            <div className="mb-6 rounded-lg border border-yellow-500/50 bg-yellow-500/20 p-4">
              <p className="text-center font-medium text-yellow-400">Transaction in progress...</p>
            </div>
          )}

          {!isExecuting && txStatus === "error" && (
            <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
              <p className="text-center font-medium text-red-400">
                {errorMessage || "Transaction failed. Please try again."}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleClaim}
              disabled={isExecuting}
              className="rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-3 font-bold text-white transition-all hover:scale-[1.03] hover:from-yellow-400 hover:to-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExecuting ? "Claiming..." : "Claim Rewards"}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
