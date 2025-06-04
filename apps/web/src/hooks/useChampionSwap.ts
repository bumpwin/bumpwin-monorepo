import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { CHAMP_MARKET_OBJECT_IDS, MOCKCOINS_OBJECT_IDS } from "bumpwin";
import { champMarket, mockcoins } from "bumpwin/suigen";
import { toast } from "sonner";

const WSUI_AMOUNT = 100n * BigInt(1e9);
const GAS_BUDGET = 50000000; // 0.05 SUI

export const useChampionSwap = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const executeSwap = async () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      const tx = new Transaction();
      const coinIn = mockcoins.wsui.mint(tx, {
        treasuryCap: MOCKCOINS_OBJECT_IDS.TREASURY_CAPS.WSUI,
        u64: WSUI_AMOUNT,
      });

      const coinOut = champMarket.cpmm.swapYToX(
        tx,
        [mockcoins.wsui.WSUI.$typeName, mockcoins.wsui.WSUI.$typeName],
        {
          pool: CHAMP_MARKET_OBJECT_IDS.POOLS.BLUE_WSUI,
          coin: coinIn,
        },
      );

      tx.transferObjects([coinOut], account.address);
      tx.setGasBudgetIfNotSet(GAS_BUDGET);

      // Execute transaction
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            toast.success("Transaction successful", {
              description: `Digest: ${result.digest.slice(0, 8)}...`,
            });
            // Navigate to champion detail page after successful transaction
            window.location.href = "/champions/1";
          },
          onError: (error) => {
            toast.error("Transaction failed", {
              description: error.message,
            });
          },
        },
      );
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Failed to execute transaction");
    }
  };

  return { executeSwap };
};
