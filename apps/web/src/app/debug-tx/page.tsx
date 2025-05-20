'use client';

import { useState, useCallback } from 'react';
import { counter, mockcoins } from 'bumpwin/suigen';
import { Transaction } from '@mysten/sui/transactions';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { MOCKCOINS_OBJECT_IDS } from 'bumpwin';
import { Result, err, ok } from 'neverthrow';
import { DryRunTransactionBlockResponse } from '@mysten/sui/client';

// Constants
const COUNTER_ID = "0x184d597dacb67afb95037132af97d146f15d1650e11cd0f1abc09c6fe8e1f0cc";
const GAS_BUDGET = 50000000; // 0.05 SUI
const WSUI_AMOUNT = 100n * BigInt(1e9);

// Custom hook for dry running transactions
const useDryRunTransaction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  const dryRunTransaction = useCallback(async (
    transaction: Transaction
  ): Promise<Result<DryRunTransactionBlockResponse, Error>> => {
    if (!currentAccount) return err(new Error('No wallet connected'));

    setIsLoading(true);
    try {
      const tx = transaction;

      tx.setSenderIfNotSet(currentAccount.address);
      tx.setGasBudgetIfNotSet(GAS_BUDGET);

      const txBytes = await tx.build({ client: suiClient });
      const dryRunResult = await suiClient.dryRunTransactionBlock({
        transactionBlock: txBytes
      });

      return ok(dryRunResult);
    } catch (error) {
      console.error('Transaction dry run error:', error);
      return err(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount, suiClient]);

  return { dryRunTransaction, isLoading };
}

const DebugTxPage = () => {
  const { dryRunTransaction, isLoading } = useDryRunTransaction();

  const handleMintWSUI = async () => {
    const tx = new Transaction();
    const wsui = mockcoins.wsui.mint(tx, {
      treasuryCap: MOCKCOINS_OBJECT_IDS.TREASURY_CAPS.WSUI,
      u64: WSUI_AMOUNT
    });
    tx.transferObjects([wsui], currentAccount!.address);

    const result = await dryRunTransaction(tx);
    result.map((dryRunResult) => {
      console.log('Mint WSUI dry run result:', dryRunResult);
    });
  };

  const handleIncrementCounter = async () => {
    const tx = new Transaction();
    counter.objectTableCounter.increment(tx, {
      root: COUNTER_ID,
      id: COUNTER_ID
    });

    const result = await dryRunTransaction(tx);
    result.map((dryRunResult) => {
      console.log('Increment counter dry run result:', dryRunResult);
    });
  };

  const currentAccount = useCurrentAccount();
  if (!currentAccount) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Please connect your wallet</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Transaction Debugger</h1>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            onClick={handleMintWSUI}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Mint WSUI'}
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            onClick={handleIncrementCounter}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Increment Counter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugTxPage;