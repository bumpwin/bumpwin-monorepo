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

// ✅ Effect-ts compliant error definition using implementation-first pattern
export const TransactionErrors = {
  preparation: (cause: unknown) => ({
    _tag: "TransactionPreparationError" as const,
    message: "Failed to prepare transaction",
    cause,
  }),

  walletNotConnected: () => ({
    _tag: "WalletNotConnectedError" as const,
    message: "Wallet is not connected",
  }),

  execution: (message: string, cause: unknown) => ({
    _tag: "TransactionExecutionError" as const,
    message,
    cause,
  }),

  gasEstimation: (cause: unknown) => ({
    _tag: "GasEstimationError" as const,
    message: "Failed to estimate gas for transaction",
    cause,
  }),

  simulation: (message: string, cause: unknown) => ({
    _tag: "TransactionSimulationError" as const,
    message: `Transaction simulation failed: ${message}`,
    cause,
  }),
} as const;

// ✅ Type inference from implementation - no double declaration
export type TransactionError = ReturnType<
  (typeof TransactionErrors)[keyof typeof TransactionErrors]
>;

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
      Effect.mapError((cause) => TransactionErrors.preparation(cause)),
      Effect.tap(() => Effect.log("Transaction prepared successfully")),
    );

    // Set gas budget
    yield* Effect.sync(() => {
      tx.setGasBudgetIfNotSet(GAS_BUDGET);
    });

    // Execute transaction using Promise-based Effect
    const result = yield* Effect.async<TransactionResult, TransactionError>((resume) => {
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            resume(Effect.succeed(result));
          },
          onError: (error) => {
            resume(Effect.fail(TransactionErrors.execution(error.message, error)));
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
          }),
        ),
        Effect.catchTags({
          WalletNotConnectedError: (error) =>
            Effect.sync(() => {
              toast.dismiss(toastId);
              toast.error("No wallet connected", {
                description: error.message,
              });
            }),
          TransactionPreparationError: (error) =>
            Effect.sync(() => {
              toast.dismiss(toastId);
              toast.error("Transaction preparation failed", {
                description: error.cause instanceof Error ? error.cause.message : error.message,
              });
            }),
          TransactionExecutionError: (error) =>
            Effect.sync(() => {
              toast.dismiss(toastId);
              toast.error("Transaction failed", {
                description: error.message,
              });
            }),
          GasEstimationError: (error) =>
            Effect.sync(() => {
              toast.dismiss(toastId);
              toast.error("Gas estimation failed", {
                description: error.message,
              });
            }),
          TransactionSimulationError: (error) =>
            Effect.sync(() => {
              toast.dismiss(toastId);
              toast.error("Transaction simulation failed", {
                description: error.message,
              });
            }),
        }),
        Effect.catchAll((_error) =>
          Effect.sync(() => {
            toast.dismiss(toastId);
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
