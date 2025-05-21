import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import type { Transaction } from "@mysten/sui/transactions";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { setupTransaction } from "./utils";

const GAS_BUDGET = 50000000; // 0.05 SUI

export const useExecuteTransaction = () => {
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
        const tx = setupTransaction(transaction, currentAccount.address);

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
