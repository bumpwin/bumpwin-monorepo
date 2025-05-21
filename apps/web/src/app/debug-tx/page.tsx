"use client";

import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import type { DryRunTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { MOCKCOINS_OBJECT_IDS } from "bumpwin";
import { counter, mockcoins } from "bumpwin/suigen";
import { type Result, err, ok } from "neverthrow";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// Constants
const COUNTER_ID =
  "0x184d597dacb67afb95037132af97d146f15d1650e11cd0f1abc09c6fe8e1f0cc";
const GAS_BUDGET = 50000000; // 0.05 SUI
const WSUI_AMOUNT = 100n * BigInt(1e9);

// Custom hook for dry running transactions
const useDryRunTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  const dryRunTransaction = useCallback(
    async (
      transaction: Transaction,
    ): Promise<Result<DryRunTransactionBlockResponse, Error>> => {
      if (!currentAccount) return err(new Error("No wallet connected"));

      setIsLoading(true);
      try {
        const tx = transaction;

        tx.setSenderIfNotSet(currentAccount.address);
        tx.setGasBudgetIfNotSet(GAS_BUDGET);

        const txBytes = await tx.build({ client: suiClient });
        const dryRunResult = await suiClient.dryRunTransactionBlock({
          transactionBlock: txBytes,
        });

        return ok(dryRunResult);
      } catch (error) {
        console.error("Transaction dry run error:", error);
        return err(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentAccount, suiClient],
  );

  return { dryRunTransaction, isLoading };
};

// Custom hook for executing transactions
const useExecuteTransaction = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const executeTransaction = useCallback(
    async (transaction: Transaction) => {
      if (!currentAccount) {
        toast.error("No wallet connected");
        return;
      }

      setIsExecuting(true);
      const toastId = toast.loading("Preparing transaction...");

      try {
        const tx = transaction;

        tx.setSenderIfNotSet(currentAccount.address);
        tx.setGasBudgetIfNotSet(GAS_BUDGET);

        signAndExecute(
          {
            transaction: tx,
          },
          {
            onSuccess: (result) => {
              toast.dismiss(toastId);
              toast.success("Transaction successful", {
                description: `Digest: ${result.digest.slice(0, 8)}...`,
              });
              console.log("Transaction result:", result);
            },
            onError: (error) => {
              toast.dismiss(toastId);
              toast.error("Transaction failed", {
                description: error.message,
              });
              console.error("Transaction execution error:", error);
            },
            onSettled: () => {
              setIsExecuting(false);
            },
          },
        );
      } catch (error) {
        toast.dismiss(toastId);
        console.error("Transaction preparation error:", error);
        toast.error("Transaction preparation failed", {
          description: (error as Error).message,
        });
        setIsExecuting(false);
      }
    },
    [currentAccount, signAndExecute],
  );

  return { executeTransaction, isExecuting };
};

const DebugTxPage = () => {
  const { dryRunTransaction, isLoading } = useDryRunTransaction();
  const { executeTransaction, isExecuting } = useExecuteTransaction();

  const handleMintWSUI = async (isDryRun = true) => {
    const tx = new Transaction();
    const wsui = mockcoins.wsui.mint(tx, {
      treasuryCap: MOCKCOINS_OBJECT_IDS.TREASURY_CAPS.WSUI,
      u64: WSUI_AMOUNT,
    });
    tx.transferObjects([wsui], currentAccount!.address);

    if (isDryRun) {
      const result = await dryRunTransaction(tx);
      result.map((dryRunResult) => {
        console.log("Mint WSUI dry run result:", dryRunResult);
        toast.success("Dry run successful", {
          description: "WSUI mint simulation completed",
        });
      });
    } else {
      await executeTransaction(tx);
    }
  };

  const handleIncrementCounter = async (isDryRun = true) => {
    const tx = new Transaction();
    counter.objectTableCounter.increment(tx, {
      root: COUNTER_ID,
      id: COUNTER_ID,
    });

    if (isDryRun) {
      const result = await dryRunTransaction(tx);
      result.map((dryRunResult) => {
        console.log("Increment counter dry run result:", dryRunResult);
        toast.success("Dry run successful", {
          description: "Counter increment simulation completed",
        });
      });
    } else {
      await executeTransaction(tx);
    }
  };

  const currentAccount = useCurrentAccount();
  if (!currentAccount) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Please connect your wallet</h1>
      </div>
    );
  }

  const isProcessing = isLoading || isExecuting;

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
              onClick={() => handleMintWSUI(true)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Dry Run"}
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              onClick={() => handleMintWSUI(false)}
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
              onClick={() => handleIncrementCounter(true)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Dry Run"}
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              onClick={() => handleIncrementCounter(false)}
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
