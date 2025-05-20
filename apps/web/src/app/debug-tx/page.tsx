'use client';

import { useState } from 'react';
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

const DebugTxPage = () => {
  const [txHash, setTxHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();

  const handleMintWSUI = async () => {
    if (!currentAccount) return;

    setIsLoading(true);
    const result = await (async () => {
      try {
        const tx = new Transaction();
        tx.setSender(currentAccount.address);
        tx.setGasBudget(GAS_BUDGET);

        const wsui = mockcoins.wsui.mint(tx, {
          treasuryCap: MOCKCOINS_OBJECT_IDS.TREASURY_CAPS.WSUI,
          u64: WSUI_AMOUNT
        });
        tx.transferObjects([wsui], currentAccount.address);

        const txBytes = await tx.build({ client: suiClient });
        const dryRunResult = await suiClient.dryRunTransactionBlock({
          transactionBlock: txBytes
        });
        return ok<DryRunTransactionBlockResponse, Error>(dryRunResult);
      } catch (error) {
        return err<DryRunTransactionBlockResponse, Error>(error as Error);
      }
    })();

    result
      .map((dryRunResult: DryRunTransactionBlockResponse) => {
        console.log('Dry run result:', dryRunResult);
        setIsLoading(false);
      })
      .mapErr((error: Error) => {
        console.error('Error minting WSUI:', error);
        setIsLoading(false);
      });
  };

  const handleIncrementCounter = async () => {
    if (!currentAccount) return;

    setIsLoading(true);
    const result = await (async () => {
      try {
        const tx = new Transaction();
        tx.setSender(currentAccount.address);
        tx.setGasBudget(GAS_BUDGET);

        counter.objectTableCounter.increment(tx, {
          root: COUNTER_ID,
          id: COUNTER_ID
        });

        const txBytes = await tx.build({ client: suiClient });
        const dryRunResult = await suiClient.dryRunTransactionBlock({
          transactionBlock: txBytes
        });
        return ok<DryRunTransactionBlockResponse, Error>(dryRunResult);
      } catch (error) {
        return err<DryRunTransactionBlockResponse, Error>(error as Error);
      }
    })();

    result
      .map((dryRunResult: DryRunTransactionBlockResponse) => {
        console.log('Dry run result:', dryRunResult);
        setIsLoading(false);
      })
      .mapErr((error: Error) => {
        console.error('Error incrementing counter:', error);
        setIsLoading(false);
      });
  };

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
        <div>
          <label htmlFor="txHash" className="block text-sm font-medium mb-2">
            Transaction Hash
          </label>
          <input
            type="text"
            id="txHash"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter transaction hash"
          />
        </div>

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