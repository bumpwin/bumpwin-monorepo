"use client";

import { useDryRunTransaction, useExecuteTransaction, useTransactionCreators } from "@/hooks";
import { useCurrentAccount } from "@mysten/dapp-kit";
import type { Transaction } from "@mysten/sui/transactions";
import { Effect } from "effect";
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
          const resultEffect = await dryRunTransaction(tx);
          const _dryRunResult = await Effect.runPromise(
            resultEffect.pipe(
              Effect.tap((result) =>
                Effect.sync(() => {
                  console.log("Dry run result:", result);
                  toast.success("Dry run successful", {
                    description: "Transaction simulation completed",
                  });
                }),
              ),
              Effect.catchAll((error) =>
                Effect.sync(() => {
                  console.error("Dry run error:", error);
                  toast.error("Dry run failed", {
                    description: error.message,
                  });
                }),
              ),
            ),
          );
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
        <h1 className="mb-6 font-bold text-2xl">Please connect your wallet</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 font-bold text-2xl">Transaction Debugger</h1>

      <div className="space-y-8">
        <div className="rounded-lg bg-muted p-6">
          <h2 className="mb-4 font-semibold text-xl">Mint WSUI</h2>
          <div className="flex gap-4">
            <button
              type="button"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
              onClick={() => handleTransaction(createMintWSUITransaction, true)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Dry Run"}
            </button>

            <button
              type="button"
              className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:opacity-50"
              onClick={() => handleTransaction(createMintWSUITransaction, false)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Execute"}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-6">
          <h2 className="mb-4 font-semibold text-xl">Increment Counter</h2>
          <div className="flex gap-4">
            <button
              type="button"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
              onClick={() => handleTransaction(createIncrementCounterTransaction, true)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Dry Run"}
            </button>

            <button
              type="button"
              className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:opacity-50"
              onClick={() => handleTransaction(createIncrementCounterTransaction, false)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Execute"}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-6">
          <h2 className="mb-4 font-semibold text-xl">Swap Champion</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Amount"
                className="rounded-lg border px-4 py-2"
                defaultValue={1}
                id="swapAmount"
              />
              <select className="rounded-lg border px-4 py-2" id="swapDirection" defaultValue="buy">
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                onClick={() => {
                  const amountInput = document.getElementById("swapAmount") as HTMLInputElement;
                  const directionSelect = document.getElementById(
                    "swapDirection",
                  ) as HTMLSelectElement;
                  const amount = Number(amountInput?.value || 1);
                  const isBuy = directionSelect?.value === "buy";
                  handleTransaction(() => createSwapChampTransaction(amount, isBuy), true);
                }}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Dry Run"}
              </button>

              <button
                type="button"
                className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 disabled:opacity-50"
                onClick={() => {
                  const amountInput = document.getElementById("swapAmount") as HTMLInputElement;
                  const directionSelect = document.getElementById(
                    "swapDirection",
                  ) as HTMLSelectElement;
                  const amount = Number(amountInput?.value || 1);
                  const isBuy = directionSelect?.value === "buy";
                  handleTransaction(() => createSwapChampTransaction(amount, isBuy), false);
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
