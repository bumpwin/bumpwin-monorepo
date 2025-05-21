import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { CHAMP_MARKET_OBJECT_IDS, MOCKCOINS_OBJECT_IDS } from "bumpwin";
import { champMarket, counter, mockcoins } from "bumpwin/suigen";
import { useCallback } from "react";

// Constants
const COUNTER_ID =
  "0x184d597dacb67afb95037132af97d146f15d1650e11cd0f1abc09c6fe8e1f0cc";

export const useTransactionCreators = () => {
  const currentAccount = useCurrentAccount();

  const createMintWSUITransaction = useCallback(() => {
    if (!currentAccount) return null;

    const tx = new Transaction();
    const wsui = mockcoins.wsui.mint(tx, {
      treasuryCap: MOCKCOINS_OBJECT_IDS.TREASURY_CAPS.WSUI,
      u64: 100n * BigInt(1e9),
    });
    tx.transferObjects([wsui], currentAccount.address);
    return tx;
  }, [currentAccount]);

  const createIncrementCounterTransaction = useCallback(() => {
    if (!currentAccount) return null;

    const tx = new Transaction();
    counter.objectTableCounter.increment(tx, {
      root: COUNTER_ID,
      id: COUNTER_ID,
    });
    return tx;
  }, [currentAccount]);

  const createSwapChampTransaction = useCallback(
    (amount: number, isBuy: boolean) => {
      if (!currentAccount) return null;

      const tx = new Transaction();
      const coinIn = mockcoins.wsui.mint(tx, {
        treasuryCap: MOCKCOINS_OBJECT_IDS.TREASURY_CAPS.WSUI,
        u64: BigInt(amount * 1e9), // Convert to SUI decimals
      });

      const coinOut = isBuy
        ? champMarket.cpmm.swapYToX(
            tx,
            [mockcoins.wsui.WSUI.$typeName, mockcoins.wsui.WSUI.$typeName],
            {
              pool: CHAMP_MARKET_OBJECT_IDS.POOLS.BLUE_WSUI,
              coin: coinIn,
            },
          )
        : champMarket.cpmm.swapXToY(
            tx,
            [mockcoins.wsui.WSUI.$typeName, mockcoins.wsui.WSUI.$typeName],
            {
              pool: CHAMP_MARKET_OBJECT_IDS.POOLS.BLUE_WSUI,
              coin: coinIn,
            },
          );

      tx.transferObjects([coinOut], currentAccount.address);
      return tx;
    },
    [currentAccount],
  );

  return {
    createMintWSUITransaction,
    createIncrementCounterTransaction,
    createSwapChampTransaction,
  };
};
