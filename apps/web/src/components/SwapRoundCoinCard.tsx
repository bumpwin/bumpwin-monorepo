"use client";

import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";
import {
  ConnectButton,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Input } from "@workspace/shadcn/components/input";
import { getSuiBalance } from "@workspace/sui";
import Image from "next/image";
import React, { useState } from "react";

interface CoinWithMarketData {
  id: number;
  symbol: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  price: number;
  marketCap: number;
  share?: number;
}

interface SwapRoundCoinCardProps {
  coin?: CoinWithMarketData;
}

const SwapRoundCoinCard: React.FC<SwapRoundCoinCardProps> = ({
  coin = (() => {
    if (mockCoinMetadata.length > 0 && mockDominanceChartData.length > 0) {
      const latestData = mockDominanceChartData[
        mockDominanceChartData.length - 1
      ] as { shares: number[] };
      if (!latestData?.shares) return undefined;
      const latestShares = latestData.shares as number[];
      const maxShare = Math.max(...latestShares);
      const maxShareIndex = latestShares.indexOf(maxShare);
      if (maxShareIndex === -1) return undefined;
      const defaultCoin = mockCoinMetadata[maxShareIndex];
      if (
        defaultCoin &&
        Number.isFinite(maxShareIndex) &&
        typeof latestShares[maxShareIndex] === "number"
      ) {
        return {
          ...defaultCoin,
          share: latestShares[maxShareIndex],
        };
      }
    }
    return undefined;
  })(),
}) => {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState<number>(0);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();

  // ウォレット接続時にSUI残高を取得
  React.useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const bal = await getSuiBalance(suiClient, account.address);
        setBalance(Number(bal));
      }
    };
    fetchBalance();
  }, [account, suiClient]);

  if (!coin) return null;

  return (
    <div className="bg-[#181A20] border border-[#23262F] rounded-2xl p-4 w-full max-w-xs mx-auto shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <Image
          src={coin.icon}
          alt={coin.name}
          width={48}
          height={48}
          className="rounded-xl"
        />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg text-white truncate">
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
              className="flex-1 rounded-xl py-3 font-bold text-lg transition bg-green-600 hover:bg-green-700 text-white"
            >
              Buy
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl py-3 font-bold text-lg transition bg-red-600 hover:bg-red-700 text-white"
            >
              Sell
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

export default SwapRoundCoinCard;
