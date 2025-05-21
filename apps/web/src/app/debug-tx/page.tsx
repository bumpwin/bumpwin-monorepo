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

  const isProcessing = isDryRunning || isExecuting;

  const handleTransaction = useCallback(
    async (createTx: () => Transaction | null, isDryRun = true) => {
      if (isProcessing) {
        toast.error("Another transaction is in progress");
        return;
      }

      const tx = createTx();
      if (!tx) {
        toast.error("Failed to create transaction");
        return;
      }

      try {
        if (isDryRun) {
          const result = await dryRunTransaction(tx);
          result.map((dryRunResult) => {
            console.log("Dry run result:", dryRunResult);
            toast.success("Dry run successful", {
              description: "Transaction simulation completed",
            });
          }).mapErr((error) => {
            console.error("Dry run error:", error);
            toast.error("Dry run failed", {
              description: error.message,
            });
          });
        } else {
          await executeTransaction(tx);
        }
      } catch (error) {
        console.error("Transaction error:", error);
        toast.error("Transaction failed", {
          description: (error as Error).message,
        });
      }
    },
    [dryRunTransaction, executeTransaction, isProcessing],
  );

  if (!currentAccount) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Please connect your wallet</h1>
      </div>
    );
  }

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
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Amount"
                className="px-4 py-2 border rounded-lg"
                defaultValue={1}
                id="swapAmount"
              />
              <select
                className="px-4 py-2 border rounded-lg"
                id="swapDirection"
                defaultValue="buy"
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                onClick={() => {
                  const amountInput = document.getElementById(
                    "swapAmount",
                  ) as HTMLInputElement;
                  const directionSelect = document.getElementById(
                    "swapDirection",
                  ) as HTMLSelectElement;
                  const amount = Number(amountInput?.value || 1);
                  const isBuy = directionSelect?.value === "buy";
                  handleTransaction(
                    () => createSwapChampTransaction(amount, isBuy),
                    true,
                  );
                }}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Dry Run"}
              </button>

              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                onClick={() => {
                  const amountInput = document.getElementById(
                    "swapAmount",
                  ) as HTMLInputElement;
                  const directionSelect = document.getElementById(
                    "swapDirection",
                  ) as HTMLSelectElement;
                  const amount = Number(amountInput?.value || 1);
                  const isBuy = directionSelect?.value === "buy";
                  handleTransaction(
                    () => createSwapChampTransaction(amount, isBuy),
                    false,
                  );
                }}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Execute"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugTxPage;
