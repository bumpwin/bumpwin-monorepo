"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { CHAMP_MARKET_OBJECT_IDS, MOCKCOINS_OBJECT_IDS } from "bumpwin";
import { champMarket, counter, mockcoins } from "bumpwin/suigen";
import { useCallback } from "react";
import { useDryRunTransaction } from "../../hooks/transactions/useDryRunTransaction";
import { useExecuteTransaction } from "../../hooks/transactions/useExecuteTransaction";

// Constants
const COUNTER_ID =
  "0x184d597dacb67afb95037132af97d146f15d1650e11cd0f1abc09c6fe8e1f0cc";
const WSUI_AMOUNT = 100n * BigInt(1e9);

const DebugTxPage = () => {
  const currentAccount = useCurrentAccount();
  const { dryRunTransaction, isLoading: isDryRunning } = useDryRunTransaction();
  const { executeTransaction, isExecuting } = useExecuteTransaction();

  const createMintWSUITransaction = useCallback(() => {
    if (!currentAccount) return null;

    const tx = new Transaction();
    const wsui = mockcoins.wsui.mint(tx, {
      treasuryCap: MOCKCOINS_OBJECT_IDS.TREASURY_CAPS.WSUI,
      u64: WSUI_AMOUNT,
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

  const createSwapChampTransaction = useCallback(() => {
    if (!currentAccount) return null;

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

    tx.transferObjects([coinOut], currentAccount.address);
    return tx;
  }, [currentAccount]);

  const handleTransaction = useCallback(
    async (createTx: () => Transaction | null, isDryRun = true) => {
      const tx = createTx();
      if (!tx) return;

      if (isDryRun) {
        await dryRunTransaction(tx);
      } else {
        await executeTransaction(tx);
      }
    },
    [dryRunTransaction, executeTransaction],
  );

  if (!currentAccount) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Please connect your wallet</h1>
      </div>
    );
  }

  const isProcessing = isDryRunning || isExecuting;

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
              onClick={() => handleTransaction(createMintWSUITransaction, true)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Dry Run"}
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              onClick={() => handleTransaction(createMintWSUITransaction, false)}
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
              onClick={() => handleTransaction(createIncrementCounterTransaction, true)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Dry Run"}
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              onClick={() => handleTransaction(createIncrementCounterTransaction, false)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Execute"}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-6">
          <h2 className="text-xl font-semibold mb-4">Swap Champion</h2>
          <div className="flex gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              onClick={() => handleTransaction(createSwapChampTransaction, true)}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Dry Run"}
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              onClick={() => handleTransaction(createSwapChampTransaction, false)}
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
