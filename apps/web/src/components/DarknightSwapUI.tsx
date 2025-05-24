"use client";

import type { RoundCoin } from "@/types/roundcoin";
import {
  ConnectButton,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Button } from "@workspace/shadcn/components/button";
import { Input } from "@workspace/shadcn/components/input";
import { getSuiBalance } from "@workspace/sui";
import Image from "next/image";
import React from "react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// モックコインリスト
const mockCoins: RoundCoin[] = [
  {
    id: "1",
    round: 1,
    name: "Dogecoin",
    symbol: "DOGE",
    iconUrl: "/icon.png",
    description: "Dogecoin is a digital currency...",
    share: 0.35,
    marketCap: 18000000000,
  },
  {
    id: "2",
    round: 1,
    name: "Pepe",
    symbol: "PEPE",
    iconUrl: "/icon.png",
    description: "Pepe is a digital currency...",
    share: 0.22,
    marketCap: 5000000000,
  },
  {
    id: "3",
    round: 1,
    name: "WIF",
    symbol: "WIF",
    iconUrl: "/icon.png",
    description: "WIF is a digital currency...",
    share: 0.13,
    marketCap: 2000000000,
  },
];

interface DarknightSwapUIProps {
  coin?: RoundCoin;
}

const quickPercentages = [25, 50, 75];

const DarknightSwapUI: React.FC<DarknightSwapUIProps> = ({ coin }) => {
  const [tab, setTab] = useState<"buy" | "switch">("buy");
  const [amount, setAmount] = useState<string>("");
  const [fromCoin, setFromCoin] = useState<RoundCoin>(mockCoins[0]);
  const [toCoin, setToCoin] = useState<RoundCoin>(mockCoins[1]);
  const [isWalletConnected] = useState(false); // ダミー
  const account = useCurrentAccount();
  const suiClient = useSuiClient();

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const bal = await getSuiBalance(suiClient, account.address);
        setAmount(String(bal));
      }
    };
    fetchBalance();
  }, [account, suiClient]);

  // クイックボタンのハンドラ
  const handleQuick = (val: string | number) => {
    if (tab === "buy") {
      if (val === "max") {
        setAmount("100"); // ダミー
      } else {
        setAmount((prev) => String(Number(prev || 0) + Number(val)));
      }
    } else {
      // Switch: 割合
      if (val === "max") {
        setAmount("100"); // ダミー
      } else {
        setAmount(String(val));
      }
    }
  };

  // コイン選択UI
  const renderCoinSelect = (
    selected: RoundCoin,
    setSelected: (c: RoundCoin) => void,
    label: string,
  ) => (
    <div className="flex items-center gap-2 bg-[#181B27] rounded-lg px-3 py-2 mb-2">
      <span className="text-xs text-gray-400 w-10">{label}</span>
      <select
        className="bg-transparent text-white font-bold text-base flex-1 outline-none"
        value={selected.id}
        onChange={(e) => {
          const coin = mockCoins.find((c) => c.id === e.target.value);
          if (coin) setSelected(coin);
        }}
      >
        {mockCoins.map((c) => (
          <option key={c.id} value={c.id} className="text-black">
            {c.symbol}
          </option>
        ))}
      </select>
      <Image
        src={selected.iconUrl}
        alt={selected.symbol}
        width={24}
        height={24}
        className="rounded-full"
      />
      <span className="text-white font-bold">{selected.symbol}</span>
    </div>
  );

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
    <div className="w-full max-w-xs mx-auto bg-[#101522] rounded-2xl p-4 shadow-lg">
      {/* タブ切り替え */}
      <div className="flex mb-4">
        <button
          type="button"
          className={
            tab === "buy"
              ? "flex-1 py-2 rounded-l-lg font-bold text-base transition-colors bg-blue-600 text-white"
              : "flex-1 py-2 rounded-l-lg font-bold text-base transition-colors bg-[#181B27] text-gray-400"
          }
          onClick={() => setTab("buy")}
        >
          Buy
        </button>
        <button
          type="button"
          className={
            tab === "switch"
              ? "flex-1 py-2 rounded-r-lg font-bold text-base transition-colors bg-purple-600 text-white"
              : "flex-1 py-2 rounded-r-lg font-bold text-base transition-colors bg-[#181B27] text-gray-400"
          }
          onClick={() => setTab("switch")}
        >
          Switch
        </button>
      </div>

      {/* コイン選択 */}
      {tab === "switch" && (
        <>
          {renderCoinSelect(fromCoin, setFromCoin, "From")}
          {renderCoinSelect(toCoin, setToCoin, "To")}
        </>
      )}
      {tab === "buy" && <>{renderCoinSelect(fromCoin, setFromCoin, "Coin")}</>}

      {/* 金額入力 */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Amount</span>
          <span className="text-xs text-gray-400">2.5% slippage</span>
        </div>
        <Input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-[#181B27] text-white text-lg font-bold px-3 py-2 rounded-lg"
          placeholder="0.0"
        />
      </div>

      {/* クイックボタン */}
      <div className="flex gap-2 mb-2">
        {tab === "buy"
          ? [
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => handleQuick(1)}
                key="1"
              >
                +1 SUI
              </Button>,
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => handleQuick(20)}
                key="20"
              >
                +20 SUI
              </Button>,
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => handleQuick("max")}
                key="max"
              >
                Max
              </Button>,
            ]
          : quickPercentages
              .map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleQuick(p)}
                >
                  {p}%
                </Button>
              ))
              .concat([
                <Button
                  key="max"
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleQuick("max")}
                >
                  Max
                </Button>,
              ])}
      </div>

      {/* 受取額表示（ダミー） */}
      <div className="text-xs text-gray-400 mb-2">
        You receive: -- {tab === "switch" ? toCoin.symbol : fromCoin.symbol}
        <br />
        (Minimum received: --{" "}
        {tab === "switch" ? toCoin.symbol : fromCoin.symbol})
      </div>

      {/* アクションボタン */}
      <Button
        type="button"
        className="w-full py-3 text-lg bg-pink-500 hover:bg-pink-600 mt-2"
      >
        {isWalletConnected
          ? tab === "buy"
            ? `Buy ${fromCoin.symbol}`
            : "Switch"
          : "Connect Wallet"}
      </Button>
    </div>
  );
};

export default DarknightSwapUI;
