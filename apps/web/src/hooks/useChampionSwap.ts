import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { CHAMP_MARKET_OBJECT_IDS, MOCKCOINS_OBJECT_IDS } from "bumpwin";
import { champMarket, mockcoins } from "bumpwin/suigen";
import { Effect } from "effect";
import { toast } from "sonner";
import { match } from "ts-pattern";

const WSUI_AMOUNT = 100n * BigInt(1e9);
const GAS_BUDGET = 50000000; // 0.05 SUI

// Effect Error types for champion swap
type ChampionSwapError = {
  readonly _tag: "ChampionSwapError";
  readonly cause: unknown;
};

type TransactionError = {
  readonly _tag: "TransactionError";
  readonly message: string;
  readonly cause: unknown;
};

type WalletNotConnectedError = {
  readonly _tag: "WalletNotConnectedError";
};

// Union type for all swap errors
type SwapErrorUnion = ChampionSwapError | TransactionError | WalletNotConnectedError;

// Error factory functions
const SwapErrors = {
  championSwapError: (cause: unknown): ChampionSwapError => ({
    _tag: "ChampionSwapError",
    cause,
  }),

  transactionError: (message: string, cause: unknown): TransactionError => ({
    _tag: "TransactionError",
    message,
    cause,
  }),

  walletNotConnected: (): WalletNotConnectedError => ({
    _tag: "WalletNotConnectedError",
  }),
} as const;

export const useChampionSwap = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // Effect-based champion swap
  const executeSwapEffect = (userAccount: { address: string }) =>
    Effect.gen(function* () {
      // Create and prepare transaction
      const tx = yield* Effect.try({
        try: () => {
          const transaction = new Transaction();
          const coinIn = mockcoins.wsui.mint(transaction, {
            treasuryCap: MOCKCOINS_OBJECT_IDS.TREASURY_CAPS.WSUI,
            u64: WSUI_AMOUNT,
          });

          const coinOut = champMarket.cpmm.swapYToX(
            transaction,
            [mockcoins.wsui.WSUI.$typeName, mockcoins.wsui.WSUI.$typeName],
            {
              pool: CHAMP_MARKET_OBJECT_IDS.POOLS.BLUE_WSUI,
              coin: coinIn,
            },
          );

          transaction.transferObjects([coinOut], userAccount.address);
          transaction.setGasBudgetIfNotSet(GAS_BUDGET);
          return transaction;
        },
        catch: (error) => SwapErrors.championSwapError(error),
      });

      // Execute transaction with Effect-wrapped callback
      const result = yield* Effect.async<{ digest: string }, TransactionError>((resume) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              resume(Effect.succeed(result));
            },
            onError: (error) => {
              resume(Effect.fail(SwapErrors.transactionError(error.message, error)));
            },
          },
        );
      });

      return result;
    });

  const executeSwap = async () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    const program = executeSwapEffect(account).pipe(
      Effect.tap((result) =>
        Effect.sync(() => {
          toast.success("Transaction successful", {
            description: `Digest: ${result.digest.slice(0, 8)}...`,
          });
          // Navigate to champion detail page after successful transaction
          window.location.href = "/champions/1";
        }),
      ),
      Effect.catchAll((error) =>
        Effect.sync(() => {
          console.error("Transaction failed:", error);

          // Handle error types using ts-pattern
          match(error as SwapErrorUnion | unknown)
            .with({ _tag: "ChampionSwapError" }, () => {
              toast.error("Failed to prepare transaction");
            })
            .with({ _tag: "TransactionError" }, (err: TransactionError) => {
              toast.error("Transaction failed", {
                description: err.message || "Unknown error",
              });
            })
            .with({ _tag: "WalletNotConnectedError" }, () => {
              toast.error("Please connect your wallet first");
            })
            .otherwise(() => {
              toast.error("Failed to execute transaction");
            });
        }),
      ),
    );

    await Effect.runPromise(program);
  };

  return { executeSwap };
};
