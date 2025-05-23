import { setupTransaction } from "@/hooks/transactions/utils";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import type { DryRunTransactionBlockResponse } from "@mysten/sui/client";
import type { Transaction } from "@mysten/sui/transactions";
import { type Result, err, ok } from "neverthrow";
import { useCallback, useState } from "react";

export const useDryRunTransaction = () => {
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
        const tx = setupTransaction(transaction, currentAccount.address);
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
