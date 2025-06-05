"use client";

import { Input } from "@/components/ui/input";
import { mockCoinMetadata, mockDominanceChartData } from "@/mock/mockData";
import type { RoundCoin } from "@/types/roundcoin";
import { ConnectButton, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { getSuiBalance } from "@workspace/sui";
import Image from "next/image";
import React, { useState } from "react";

interface SwapRoundCoinCardProps {
  coin?: RoundCoin;
}

const SwapRoundCoinCard: React.FC<SwapRoundCoinCardProps> = ({
  coin = (() => {
    if (mockCoinMetadata.length > 0 && mockDominanceChartData.length > 0) {
      const latestData = mockDominanceChartData[mockDominanceChartData.length - 1] as {
        shares: number[];
      };
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
          id: defaultCoin.id.toString(),
          symbol: defaultCoin.symbol,
          name: defaultCoin.name,
          iconUrl: defaultCoin.icon,
          round: 1,
          share: latestShares[maxShareIndex],
          marketCap: 0,
          description: defaultCoin.description,
          telegramLink: defaultCoin.telegramLink,
          websiteLink: defaultCoin.websiteLink,
          twitterLink: defaultCoin.twitterLink,
          color: defaultCoin.color,
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
    <div className="mx-auto w-full max-w-xs rounded-2xl border border-[#23262F] bg-[#181A20] p-4 shadow-lg">
      <div className="mb-2 flex items-center gap-3">
        <Image src={coin.iconUrl} alt={coin.name} width={48} height={48} className="rounded-xl" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-bold text-lg text-white">{coin.name}</div>
        </div>
      </div>
      <div className="mb-2 font-medium text-gray-400">Amount</div>
      <div className="mb-2 flex items-center gap-2">
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
          className="w-full rounded-lg bg-[#23262F] px-6 py-6 font-bold text-4xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />
        <span className="font-bold text-2xl text-gray-400">SUI</span>
      </div>
      <div className="mb-6 flex gap-2">
        {[1, 20].map((v) => (
          <button
            type="button"
            key={v}
            className="rounded-lg bg-[#23262F] px-3 py-1 font-semibold text-gray-300 text-sm hover:bg-[#2c2f38]"
            onClick={() => setAmount(amount + v)}
          >
            +{v} SUI
          </button>
        ))}
        <button
          type="button"
          className="rounded-lg bg-[#23262F] px-3 py-1 font-semibold text-gray-300 text-sm hover:bg-[#2c2f38]"
          onClick={() => setAmount(balance)}
        >
          Max
        </button>
      </div>
      <div className="mb-6 flex gap-2">
        {account ? (
          <>
            <button
              type="button"
              className="flex-1 rounded-xl bg-green-600 py-3 font-bold text-lg text-white transition hover:bg-green-700"
            >
              Buy
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-lg text-white transition hover:bg-red-700"
            >
              Sell
            </button>
          </>
        ) : (
          <>
            <ConnectButton
              connectText={<div className="!text-white w-full text-center">Login to Trade</div>}
              className="!bg-blue-500 !text-white !min-w-0 !h-auto !px-0 !border-none !shadow-none !ring-0 flex-1 rounded-xl !hover:bg-blue-600 py-3 font-bold text-lg transition"
            />
          </>
        )}
      </div>
      <div className="mt-6 text-center text-gray-500 text-xs">
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
