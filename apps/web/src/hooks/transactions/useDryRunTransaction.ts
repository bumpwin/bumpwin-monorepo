import { setupTransaction } from "@/hooks/transactions/utils";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import type { DryRunTransactionBlockResponse } from "@mysten/sui/client";
import type { Transaction } from "@mysten/sui/transactions";
import { Effect } from "effect";
import { useCallback, useState } from "react";

export const useDryRunTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  const dryRunTransaction = useCallback(
    async (
      transaction: Transaction,
    ): Promise<Effect.Effect<DryRunTransactionBlockResponse, Error>> => {
      if (!currentAccount) return Effect.fail(new Error("No wallet connected"));

      setIsLoading(true);

      const effect = Effect.gen(function* () {
        const tx = setupTransaction(transaction, currentAccount.address);
        const txBytes = yield* Effect.tryPromise({
          try: () => tx.build({ client: suiClient }),
          catch: (error) => error as Error,
        });

        const dryRunResult = yield* Effect.tryPromise({
          try: () =>
            suiClient.dryRunTransactionBlock({
              transactionBlock: txBytes,
            }),
          catch: (error) => error as Error,
        });

        return dryRunResult;
      }).pipe(
        Effect.ensuring(Effect.sync(() => setIsLoading(false))),
        Effect.tapError((error) =>
          Effect.sync(() => console.error("Transaction dry run error:", error)),
        ),
      );

      return effect;
    },
    [currentAccount, suiClient],
  );

  return { dryRunTransaction, isLoading };
};
