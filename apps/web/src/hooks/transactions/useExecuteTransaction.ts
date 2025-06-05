import { setupTransaction } from "@/hooks/transactions/utils";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import type { Transaction } from "@mysten/sui/transactions";
import { Effect } from "effect";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// Transaction result type based on Context7 docs: { digest, effects }
interface TransactionResult {
  digest: string;
  effects?: string; // BCS-encoded effects
}

const GAS_BUDGET = 50000000; // 0.05 SUI

// Effect Error types using union types (function syntax)
export type TransactionPreparationError = {
  readonly _tag: "TransactionPreparationError";
  readonly cause: unknown;
};

export type WalletNotConnectedError = {
  readonly _tag: "WalletNotConnectedError";
};

export type TransactionExecutionError = {
  readonly _tag: "TransactionExecutionError";
  readonly message: string;
  readonly cause: unknown;
};

// Error factory functions
export const TransactionErrors = {
  preparationError: (cause: unknown): TransactionPreparationError => ({
    _tag: "TransactionPreparationError",
    cause,
  }),

  walletNotConnected: (): WalletNotConnectedError => ({
    _tag: "WalletNotConnectedError",
  }),

  executionError: (message: string, cause: unknown): TransactionExecutionError => ({
    _tag: "TransactionExecutionError",
    message,
    cause,
  }),
} as const;

// Effect-based transaction execution
const executeTransactionEffect = (
  transaction: Transaction,
  currentAccount: { address: string } | null,
  signAndExecute: (
    args: { transaction: Transaction },
    options: {
      onSuccess: (result: TransactionResult) => void;
      onError: (error: Error) => void;
      onSettled: () => void;
    },
  ) => void,
) =>
  Effect.gen(function* () {
    // Check wallet connection
    if (!currentAccount) {
      yield* Effect.fail(TransactionErrors.walletNotConnected());
    }

    // Prepare transaction
    const tx = yield* Effect.try(() =>
      setupTransaction(transaction, currentAccount?.address || ""),
    ).pipe(
      Effect.mapError((cause) => TransactionErrors.preparationError(cause)),
      Effect.tap(() => Effect.log("Transaction prepared successfully")),
    );

    // Set gas budget
    yield* Effect.sync(() => {
      tx.setGasBudgetIfNotSet(GAS_BUDGET);
    });

    // Execute transaction using Promise-based Effect
    const result = yield* Effect.async<TransactionResult, TransactionExecutionError>((resume) => {
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            resume(Effect.succeed(result));
          },
          onError: (error) => {
            resume(Effect.fail(TransactionErrors.executionError(error.message, error)));
          },
          onSettled: () => {
            // This will be handled by the hook's state management
          },
        },
      );
    });

    yield* Effect.log(`Transaction successful: ${result.digest}`);
    return result;
  });

export const useExecuteTransaction = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const executeTransaction = useCallback(
    async (transaction: Transaction) => {
      setIsExecuting(true);
      const toastId = toast.loading("Preparing transaction...");

      const program = executeTransactionEffect(transaction, currentAccount, signAndExecute).pipe(
        Effect.tap((result) =>
          Effect.sync(() => {
            toast.dismiss(toastId);
            toast.success("Transaction successful", {
              description: `Digest: ${result.digest.slice(0, 8)}...`,
            });
            console.log("Transaction result:", result);
          }),
        ),
        Effect.catchTags({
          WalletNotConnectedError: () =>
            Effect.sync(() => {
              toast.dismiss(toastId);
              toast.error("No wallet connected");
            }),
          TransactionPreparationError: (error) =>
            Effect.sync(() => {
              toast.dismiss(toastId);
              console.error("Transaction preparation error:", error.cause);
              toast.error("Transaction preparation failed", {
                description: error.cause instanceof Error ? error.cause.message : "Unknown error",
              });
            }),
          TransactionExecutionError: (error) =>
            Effect.sync(() => {
              toast.dismiss(toastId);
              toast.error("Transaction failed", {
                description: error.message,
              });
              console.error("Transaction execution error:", error.cause);
            }),
        }),
        Effect.catchAll((error) =>
          Effect.sync(() => {
            toast.dismiss(toastId);
            console.error("Unexpected transaction error:", error);
            toast.error("Transaction failed", {
              description: "An unexpected error occurred",
            });
          }),
        ),
        Effect.tap(() =>
          Effect.sync(() => {
            setIsExecuting(false);
          }),
        ),
      );

      return Effect.runPromise(program);
    },
    [currentAccount, signAndExecute],
  );

  // Effect-based version for composability
  const executeTransactionComposable = useCallback(
    (transaction: Transaction) => {
      return executeTransactionEffect(transaction, currentAccount, signAndExecute);
    },
    [currentAccount, signAndExecute],
  );

  return {
    executeTransaction,
    executeTransactionComposable,
    isExecuting,
  };
};
