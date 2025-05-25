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
import { ArrowDown, ChevronDown, Info, Settings } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const defaultCoin: RoundCoin = {
  id: "default",
  round: 1,
  name: "Default Coin",
  symbol: "DEF",
  iconUrl: "/icon.png",
  description: "Default coin...",
  share: 0,
  marketCap: 0,
};

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

// Ensure mockCoins is not empty
if (mockCoins.length === 0) {
  throw new Error("mockCoins array must not be empty");
}

type DarknightSwapUIProps = Record<string, never>;

type ActionTab = "buy" | "switch";

const DarknightSwapUI: React.FC<DarknightSwapUIProps> = () => {
  const [tab, setTab] = useState<ActionTab>("buy");
  const [amount, setAmount] = useState<string>("");
  const [fromCoin, setFromCoin] = useState<RoundCoin>(
    () => mockCoins[0] ?? defaultCoin,
  );
  const [toCoin, setToCoin] = useState<RoundCoin>(
    () => mockCoins[1] ?? defaultCoin,
  );
  const [isWalletConnected] = useState(false); // ダミー
  const [slippage, setSlippage] = useState(2.5);
  const [showSettings, setShowSettings] = useState(false);
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

  // スリッページ調整
  const handleSlippageChange = (newSlippage: number) => {
    setSlippage(newSlippage);
  };

  // コイン選択UI
  const CoinSelectButton = ({
    selected,
    onSelect,
    label,
  }: {
    selected: RoundCoin;
    onSelect: (coin: RoundCoin) => void;
    label?: string;
  }) => (
    <div className="w-full">
      {label && (
        <div className="text-xs text-gray-400 mb-1 font-medium">{label}</div>
      )}
      <button
        type="button"
        onClick={() => {
          // 実際の実装ではモーダルやドロップダウンでコイン選択UIを表示
          const nextIndex =
            (mockCoins.findIndex((c) => c.id === selected.id) + 1) %
            mockCoins.length;
          onSelect(mockCoins[nextIndex] ?? defaultCoin);
        }}
        className="flex items-center justify-between w-full bg-[#1E2136] hover:bg-[#282D45] rounded-xl px-4 py-3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-700">
            <Image
              src={selected.iconUrl}
              alt={selected.symbol}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white font-bold">{selected.symbol}</span>
            <span className="text-xs text-gray-400">{selected.name}</span>
          </div>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>
    </div>
  );

  // トランザクション処理（仮実装）
  const handleAction = () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Invalid amount");
      return;
    }

    toast.success(`${tab === "buy" ? "Buy" : "Switch"} transaction initiated`);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-gradient-to-b from-[#0F1225] to-[#1A1E32] rounded-2xl p-5 shadow-xl border border-[#2A2F45]">
        {/* ヘッダー: タブとセッティング */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex bg-[#16192C] p-1 rounded-lg">
            {(["buy", "switch"] as ActionTab[]).map((actionTab) => (
              <button
                key={actionTab}
                type="button"
                className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                  tab === actionTab
                    ? "bg-[#3C41FF] text-white shadow-md"
                    : "text-gray-400 hover:text-gray-300"
                }`}
                onClick={() => setTab(actionTab)}
              >
                {actionTab === "buy" ? "Buy" : "Switch"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${
              showSettings
                ? "bg-[#2A2F45] text-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <Settings size={18} />
          </button>
        </div>

        {/* スリッページ設定 (条件付き表示) */}
        {showSettings && (
          <div className="mb-4 p-3 bg-[#16192C] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 flex items-center gap-1">
                Slippage Tolerance <Info size={14} className="text-gray-500" />
              </span>
              <span className="text-sm font-medium text-blue-400">
                {slippage}%
              </span>
            </div>
            <div className="flex gap-2">
              {[0.5, 1, 2.5, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSlippageChange(value)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    slippage === value
                      ? "bg-blue-600 text-white"
                      : "bg-[#20243A] text-gray-400 hover:bg-[#282D45]"
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* メインコンテンツ */}
        <div className="space-y-4">
          {/* From */}
          <div className="bg-[#16192C] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                {tab === "buy" ? "Pay with" : "From"}
              </span>
              <span className="text-xs text-gray-500">Balance: 100 SUI</span>
            </div>
            <div className="flex items-end gap-3">
              <Input
                type="text"
                value={amount}
                onChange={(e) => {
                  // 数値とドットのみ許可
                  if (/^[\d.]*$/.test(e.target.value)) {
                    setAmount(e.target.value);
                  }
                }}
                className="bg-transparent border-none text-2xl font-bold text-white p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="0.0"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 px-2 text-xs bg-[#20243A] text-gray-300 border-none hover:bg-[#282D45] hover:text-white"
                  onClick={() => handleQuick("max")}
                >
                  MAX
                </Button>
              </div>
            </div>
            <div className="mt-3">
              <CoinSelectButton selected={fromCoin} onSelect={setFromCoin} />
            </div>
          </div>

          {/* 矢印 */}
          {tab === "switch" && (
            <div className="flex justify-center -my-2">
              <div className="bg-[#2A2F45] p-2 rounded-full">
                <ArrowDown size={16} className="text-gray-400" />
              </div>
            </div>
          )}

          {/* To (Switchモードのみ) */}
          {tab === "switch" && (
            <div className="bg-[#16192C] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">To</span>
                <span className="text-xs text-gray-500">
                  Balance: 0 {toCoin.symbol}
                </span>
              </div>
              <div className="flex items-end gap-3">
                <div className="text-2xl font-bold text-white">
                  {Number(amount) > 0
                    ? (Number(amount) * 0.95).toFixed(2)
                    : "0.0"}
                </div>
              </div>
              <div className="mt-3">
                <CoinSelectButton selected={toCoin} onSelect={setToCoin} />
              </div>
            </div>
          )}

          {/* クイックボタン */}
          <div className="flex gap-2 pt-2">
            {tab === "buy" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-[#20243A] border-none text-gray-300 hover:bg-[#282D45] hover:text-white"
                  onClick={() => handleQuick(1)}
                >
                  +1 SUI
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-[#20243A] border-none text-gray-300 hover:bg-[#282D45] hover:text-white"
                  onClick={() => handleQuick(20)}
                >
                  +20 SUI
                </Button>
              </>
            ) : (
              [25, 50, 75].map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant="outline"
                  className="flex-1 bg-[#20243A] border-none text-gray-300 hover:bg-[#282D45] hover:text-white"
                  onClick={() => handleQuick(p)}
                >
                  {p}%
                </Button>
              ))
            )}
          </div>

          {/* 受取額表示 */}
          {Number(amount) > 0 && (
            <div className="bg-[#16192C] rounded-xl p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">You receive</span>
                <span className="text-white font-medium">
                  {tab === "buy"
                    ? `${(Number(amount) * 0.95).toFixed(2)} ${fromCoin.symbol}`
                    : `${(Number(amount) * 0.95).toFixed(2)} ${toCoin.symbol}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-gray-500">
                  Minimum received after slippage ({slippage}%)
                </span>
                <span className="text-gray-400">
                  {tab === "buy"
                    ? `${(Number(amount) * 0.95 * (1 - slippage / 100)).toFixed(4)} ${fromCoin.symbol}`
                    : `${(Number(amount) * 0.95 * (1 - slippage / 100)).toFixed(4)} ${toCoin.symbol}`}
                </span>
              </div>
            </div>
          )}

          {/* アクションボタン */}
          {isWalletConnected ? (
            <Button
              type="button"
              className={`w-full py-6 text-lg font-bold rounded-xl transition-colors ${
                tab === "buy"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
              }`}
              onClick={handleAction}
              disabled={!amount || Number(amount) <= 0}
            >
              {tab === "buy" ? `Buy ${fromCoin.symbol}` : "Switch"}
            </Button>
          ) : (
            <ConnectButton
              connectText="Connect Wallet"
              className="w-full !py-6 !text-lg !font-bold !rounded-xl !transition-colors !bg-gradient-to-r !from-blue-600 !to-blue-500 !hover:from-blue-700 !hover:to-blue-600 !text-white !min-w-0 !h-auto !px-0 !border-none !shadow-none !ring-0"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DarknightSwapUI;
