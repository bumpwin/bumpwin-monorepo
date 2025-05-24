"use client";
import { useExecuteTransaction } from "@/hooks/transactions/useExecuteTransaction";
import { useTransactionCreators } from "@/hooks/transactions/useTransactionCreators";
import type { RoundCoin } from "@/types/roundcoin";
import {
  ConnectButton,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Input } from "@workspace/shadcn/components/input";
import { getSuiBalance } from "@workspace/sui";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

interface SwapUIProps {
  coin?: RoundCoin;
  variant?: "default" | "champion";
}

const SwapUI: React.FC<SwapUIProps> = ({ coin, variant = "default" }) => {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState<number>(0);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { createSwapChampTransaction } = useTransactionCreators();
  const { executeTransaction, isExecuting } = useExecuteTransaction();

  React.useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const bal = await getSuiBalance(suiClient, account.address);
        setBalance(Number(bal));
      }
    };
    fetchBalance();
  }, [account, suiClient]);

  const handleTransaction = async (isBuy: boolean) => {
    if (!amount || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }

    const tx = createSwapChampTransaction(amount, isBuy);
    if (!tx) {
      toast.error("Failed to create transaction");
      return;
    }

    await executeTransaction(tx);
  };

  if (!coin) return null;

  return (
    <div className="bg-black/20 border border-[#23262F] rounded-2xl p-4 w-full max-w-xs mx-auto shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`relative w-12 h-12 rounded-xl border overflow-hidden ${
            variant === "champion"
              ? "border-yellow-500/30"
              : "border-purple-500/30"
          }`}
        >
          <Image
            src={coin.iconUrl}
            alt={coin.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`font-bold text-lg truncate ${
              variant === "champion" ? "text-yellow-400" : "text-white"
            }`}
          >
            {coin.name}
          </div>
        </div>
      </div>
      <div className="mb-2 text-gray-400 font-medium">Amount</div>
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="text"
          min={0}
          value={amount}
          onChange={(e) => {
            let val = e.target.value;
            if (val === "") {
              setAmount(0);
              return;
            }
            if (!/^\d+$/.test(val)) return;
            val = val.replace(/^0+(?=\d)/, "");
            setAmount(Number(val));
          }}
          className="w-full bg-[#23262F] text-white rounded-lg px-6 py-6 text-4xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />
        <span className="text-2xl font-bold text-gray-400">SUI</span>
      </div>
      <div className="flex gap-2 mb-6">
        {[1, 20].map((v) => (
          <button
            type="button"
            key={v}
            className="bg-[#23262F] text-gray-300 rounded-lg px-3 py-1 text-sm font-semibold hover:bg-[#2c2f38]"
            onClick={() => setAmount(amount + v)}
          >
            +{v} SUI
          </button>
        ))}
        <button
          type="button"
          className="bg-[#23262F] text-gray-300 rounded-lg px-3 py-1 text-sm font-semibold hover:bg-[#2c2f38]"
          onClick={() => setAmount(balance)}
        >
          Max
        </button>
      </div>
      <div className="flex gap-2 mb-6">
        {account ? (
          <>
            <button
              type="button"
              className="flex-1 rounded-xl py-3 font-bold text-lg transition bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              onClick={() => handleTransaction(true)}
              disabled={isExecuting || amount <= 0}
            >
              {isExecuting ? "Processing..." : "Buy"}
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl py-3 font-bold text-lg transition bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              onClick={() => handleTransaction(false)}
              disabled={isExecuting || amount <= 0}
            >
              {isExecuting ? "Processing..." : "Sell"}
            </button>
          </>
        ) : (
          <>
            <ConnectButton
              connectText={
                <div className="w-full text-center !text-white">
                  Login to Trade
                </div>
              }
              className="flex-1 !bg-blue-500 !hover:bg-blue-600 !text-white font-bold py-3 rounded-xl text-lg transition !min-w-0 !h-auto !px-0 !border-none !shadow-none !ring-0"
            />
          </>
        )}
      </div>
      <div className="mt-6 text-center text-xs text-gray-500">
        By trading, you agree to the{" "}
        <a href="/terms" className="underline">
          Terms of Use
        </a>
        .
      </div>
    </div>
  );
};

export default SwapUI;
