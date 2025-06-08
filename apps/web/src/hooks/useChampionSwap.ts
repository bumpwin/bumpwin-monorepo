import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { CHAMP_MARKET_OBJECT_IDS, MOCKCOINS_OBJECT_IDS } from "bumpwin";
import { champMarket, mockcoins } from "bumpwin/suigen";
import { Effect } from "effect";
import { toast } from "sonner";

const WSUI_AMOUNT = 100n * BigInt(1e9);
const GAS_BUDGET = 50000000; // 0.05 SUI

// ✅ Effect-ts compliant error definition using implementation-first pattern
const ChampionSwapErrors = {
  preparation: (cause: unknown) => ({
    _tag: "ChampionSwapPreparationError" as const,
    message: "Failed to prepare champion swap transaction",
    cause,
  }),

  execution: (message: string, cause: unknown) => ({
    _tag: "ChampionSwapExecutionError" as const,
    message: `Champion swap execution failed: ${message}`,
    cause,
  }),

  walletNotConnected: () => ({
    _tag: "ChampionSwapWalletError" as const,
    message: "Wallet is not connected",
  }),

  mint: (cause: unknown) => ({
    _tag: "ChampionSwapMintError" as const,
    message: "Failed to mint tokens for swap",
    cause,
  }),

  swap: (cause: unknown) => ({
    _tag: "ChampionSwapError" as const,
    message: "Failed to execute champion market swap",
    cause,
  }),

  transfer: (cause: unknown) => ({
    _tag: "ChampionSwapTransferError" as const,
    message: "Failed to transfer tokens after swap",
    cause,
  }),
} as const;

// ✅ Type inference from implementation - no double declaration
type ChampionSwapError = ReturnType<(typeof ChampionSwapErrors)[keyof typeof ChampionSwapErrors]>;

export const useChampionSwap = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // Effect-based champion swap
  const executeSwapEffect = (userAccount: { address: string }) =>
    Effect.gen(function* () {
      // Create and prepare transaction with detailed error handling
      const tx = yield* Effect.try({
        try: () => {
          const transaction = new Transaction();

          // Step 1: Mint tokens
          const coinIn = mockcoins.wsui.mint(transaction, {
            treasuryCap: MOCKCOINS_OBJECT_IDS.TREASURY_CAPS.WSUI,
            u64: WSUI_AMOUNT,
          });

          // Step 2: Execute swap
          const coinOut = champMarket.cpmm.swapYToX(
            transaction,
            [mockcoins.wsui.WSUI.$typeName, mockcoins.wsui.WSUI.$typeName],
            {
              pool: CHAMP_MARKET_OBJECT_IDS.POOLS.BLUE_WSUI,
              coin: coinIn,
            },
          );

          // Step 3: Transfer result
          transaction.transferObjects([coinOut], userAccount.address);
          transaction.setGasBudgetIfNotSet(GAS_BUDGET);
          return transaction;
        },
        catch: (error) => ChampionSwapErrors.preparation(error),
      });

      // Execute transaction with Effect-wrapped callback
      const result = yield* Effect.async<{ digest: string }, ChampionSwapError>((resume) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              resume(Effect.succeed(result));
            },
            onError: (error) => {
              resume(Effect.fail(ChampionSwapErrors.execution(error.message, error)));
            },
          },
        );
      });

      return result;
    });

  const executeSwap = async () => {
    // ✅ Pre-validation with early return
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    // ✅ Effect-ts Error Handling Aggregation Pattern
    const program = Effect.gen(function* () {
      // Execute the swap operation
      const result = yield* executeSwapEffect(account);

      // Success handling
      yield* Effect.sync(() => {
        toast.success("Champion swap successful", {
          description: `Transaction: ${result.digest.slice(0, 8)}...`,
        });
        // Navigate to champion detail page after successful transaction
        window.location.href = "/champions/1";
      });

      return result;
    }).pipe(
      // ✅ ALL ERROR HANDLING AGGREGATED AT THE END
      Effect.catchTags({
        ChampionSwapPreparationError: (error) =>
          Effect.sync(() => {
            console.error("Champion swap preparation failed:", error.cause);
            toast.error("Failed to prepare transaction", {
              description: error.message,
            });
          }),

        ChampionSwapExecutionError: (error) =>
          Effect.sync(() => {
            console.error("Champion swap execution failed:", error.cause);
            toast.error("Transaction execution failed", {
              description: error.message,
            });
          }),

        ChampionSwapWalletError: (error) =>
          Effect.sync(() => {
            toast.error("Wallet connection required", {
              description: error.message,
            });
          }),

        ChampionSwapMintError: (error) =>
          Effect.sync(() => {
            console.error("Token minting failed:", error.cause);
            toast.error("Failed to mint tokens", {
              description: error.message,
            });
          }),

        ChampionSwapError: (error) =>
          Effect.sync(() => {
            console.error("Champion market swap failed:", error.cause);
            toast.error("Swap operation failed", {
              description: error.message,
            });
          }),

        ChampionSwapTransferError: (error) =>
          Effect.sync(() => {
            console.error("Token transfer failed:", error.cause);
            toast.error("Failed to transfer tokens", {
              description: error.message,
            });
          }),
      }),

      // ✅ Catch-all for unexpected errors
      Effect.catchAll((error) =>
        Effect.sync(() => {
          console.error("Unexpected champion swap error:", error);
          toast.error("Champion swap failed", {
            description: "An unexpected error occurred",
          });
        }),
      ),
    );

    await Effect.runPromise(program);
  };

  return { executeSwap };
};
