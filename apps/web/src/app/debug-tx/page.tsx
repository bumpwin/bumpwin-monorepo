"use client";

import { useDryRunTransaction } from "@/hooks/transactions/useDryRunTransaction";
import { useExecuteTransaction } from "@/hooks/transactions/useExecuteTransaction";
import { useTransactionCreators } from "@/hooks/transactions/useTransactionCreators";
import { useCurrentAccount } from "@mysten/dapp-kit";
import type { Transaction } from "@mysten/sui/transactions";
import { useCallback } from "react";
import { toast } from "sonner";

const DebugTxPage = () => {
  const currentAccount = useCurrentAccount();
  const { dryRunTransaction, isLoading: isDryRunning } = useDryRunTransaction();
  const { executeTransaction, isExecuting } = useExecuteTransaction();
  const {
    createMintWSUITransaction,
    createIncrementCounterTransaction,
    createSwapChampTransaction,
  } = useTransactionCreators();

  const handleTransaction = useCallback(
    async (createTx: () => Transaction | null, isDryRun = true) => {
      const tx = createTx();
      if (!tx) return;

      if (isDryRun) {
        const result = await dryRunTransaction(tx);
        result.map((dryRunResult) => {
          console.log("Dry run result:", dryRunResult);
          toast.success("Dry run successful", {
            description: "Transaction simulation completed",
          });
        });
      } else {
        await executeTransaction(tx);
      }
    },
    [dryRunTransaction, executeTransaction],
  );

  if (!currentAccount) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Please connect your wallet</h1>
      </div>
    );
  }

  const isProcessing = isDryRunning || isExecuting;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Transaction Debugger</h1>

      <div className="space-y-8">
        <div className="rounded-lg bg-muted p-6">
          <h2 className="text-xl font-semibold mb-4">Mint WSUI</h2>
          <div className="flex gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              onClick={() => handleTransaction(createMintWSUITransaction, true)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Dry Run"}
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              onClick={() =>
                handleTransaction(createMintWSUITransaction, false)
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Execute"}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-6">
          <h2 className="text-xl font-semibold mb-4">Increment Counter</h2>
          <div className="flex gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              onClick={() =>
                handleTransaction(createIncrementCounterTransaction, true)
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Dry Run"}
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              onClick={() =>
                handleTransaction(createIncrementCounterTransaction, false)
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Execute"}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-6">
          <h2 className="text-xl font-semibold mb-4">Swap Champion</h2>
          <div className="flex gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              onClick={() =>
                handleTransaction(createSwapChampTransaction, true)
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Dry Run"}
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              onClick={() =>
                handleTransaction(createSwapChampTransaction, false)
              }
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Execute"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugTxPage;
