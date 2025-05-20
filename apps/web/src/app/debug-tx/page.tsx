'use client';

import { useState } from 'react';
import * as bumpwin from 'bumpwin';

export default function DebugTxPage() {
  const [txHash, setTxHash] = useState('');

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

        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => {
            bumpwin.hello()
          }}
        >
          Counter Increment
        </button>
      </div>
    </div>
  );
}