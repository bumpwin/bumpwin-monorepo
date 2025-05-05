"use client";

import { formatCurrency } from "@/utils/format";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { CoinDetailData } from "../mock/mockCoinDetail";
import CommunicationPanel from "./CommunicationPanel";
import LWCChart from "./LWCChart";
import SwapPanel from "./SwapPanel";

// LWCChartのデータ型を定義
interface OHLCData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

type TabType = "transactions" | "holders";

// モックのトランザクションデータ
const mockTransactions = [
  {
    account: "H58Lp...iGLKX",
    type: "buy",
    solAmount: 0.001,
    tokenAmount: 3.9257,
    time: "05-05 06:20:10",
  },
  {
    account: "Emv48...ujtrk",
    type: "buy",
    solAmount: 0.001,
    tokenAmount: 3.9258,
    time: "05-05 06:19:59",
  },
  {
    account: "9e5Fn...uyh87",
    type: "buy",
    solAmount: 0.00083,
    tokenAmount: 3.2585,
    time: "05-05 06:19:53",
  },
  // 他のトランザクションデータ省略
];

// モックのホルダーデータ
const mockHolders = [
  {
    account: "9e5Fn...uyh87",
    balance: 18.3721,
    percentage: 22.8,
    value: 5928.52,
  },
  {
    account: "H58Lp...iGLKX",
    balance: 12.5821,
    percentage: 15.7,
    value: 4061.82,
  },
  // 他のホルダーデータ省略
];

interface CoinDetailClientProps {
  coinData: CoinDetailData;
  chartData: OHLCData[];
  round_id: string;
}

export default function CoinDetailClient({
  coinData,
  chartData,
  round_id,
}: CoinDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("transactions");
  const [showMyTransactions, setShowMyTransactions] = useState(false);

  // Format created time
  const createdTimeAgo = formatDistanceToNow(coinData.createdAt, {
    addSuffix: true,
  });

  // Format price change color
  const priceChangeColor =
    coinData.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-800">
              <Image
                src={coinData.logoUrl}
                alt={coinData.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{coinData.name}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="px-2 py-0.5 bg-slate-800 rounded text-xs font-mono">
                  {coinData.symbol}
                </span>
                <span>Round {round_id}</span>
                <span>Created {createdTimeAgo}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold">
              ${coinData.price.toFixed(6)}
            </div>
            <div className={`text-sm ${priceChangeColor}`}>
              {coinData.priceChangePercentage24h >= 0 ? "+" : ""}
              {coinData.priceChangePercentage24h.toFixed(2)}% (24h)
            </div>
          </div>
        </div>

        {/* Price stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-sm text-slate-400 mb-1">Market Cap</div>
            <div className="text-lg font-semibold">
              {formatCurrency(coinData.marketCap)}
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-sm text-slate-400 mb-1">24h Volume</div>
            <div className="text-lg font-semibold">
              {formatCurrency(coinData.volume24h)}
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-sm text-slate-400 mb-1">24h High</div>
            <div className="text-lg font-semibold">
              ${coinData.high24h.toFixed(6)}
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="text-sm text-slate-400 mb-1">24h Low</div>
            <div className="text-lg font-semibold">
              ${coinData.low24h.toFixed(6)}
            </div>
          </div>
        </div>

        {/* Chart and swap container */}
        <div className="flex gap-6 h-[500px]">
          {/* Chart */}
          <div className="flex-1">
            <LWCChart data={chartData} currentPrice={coinData.price} />
          </div>

          {/* Swap panel */}
          <div className="w-80">
            <SwapPanel coinData={coinData} />
          </div>
        </div>

        {/* About section */}
        <div className="mt-6 bg-slate-800 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">About {coinData.name}</h2>
          <p className="text-slate-300">{coinData.description}</p>
        </div>

        {/* Tab navigation */}
        <div className="mb-4">
          <div className="bg-slate-800 rounded-full p-1 flex w-fit">
            <button
              type="button"
              className={`px-6 py-2 rounded-full text-sm ${activeTab === "transactions" ? "bg-blue-500 text-white" : "text-slate-300 hover:text-white"}`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </button>
            <button
              type="button"
              className={`px-6 py-2 rounded-full text-sm ${activeTab === "holders" ? "bg-blue-500 text-white" : "text-slate-300 hover:text-white"}`}
              onClick={() => setActiveTab("holders")}
            >
              Holders
            </button>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "transactions" && (
          <div className="bg-slate-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <div className="flex items-center">
                <label className="flex items-center text-sm text-slate-300 mr-6">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-slate-700"
                    checked={showMyTransactions}
                    onChange={(e) => setShowMyTransactions(e.target.checked)}
                  />
                  My transactions
                </label>
                <label className="flex items-center text-sm text-slate-300">
                  <span className="mr-2">Size greater than</span>
                  <input
                    type="text"
                    className="w-16 h-8 bg-slate-700 border-slate-600 rounded px-2 text-white text-xs"
                    placeholder="0.0"
                  />
                  <span className="ml-2">SOL</span>
                </label>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-sm font-normal text-slate-400 py-2">
                      Account
                    </th>
                    <th className="text-left text-sm font-normal text-slate-400 py-2">
                      Type
                    </th>
                    <th className="text-left text-sm font-normal text-slate-400 py-2">
                      SOL Amount
                    </th>
                    <th className="text-left text-sm font-normal text-slate-400 py-2">
                      Token Amount
                    </th>
                    <th className="text-left text-sm font-normal text-slate-400 py-2">
                      Time
                    </th>
                    <th className="text-left text-sm font-normal text-slate-400 py-2">
                      Tx Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((tx) => (
                    <tr
                      key={`tx-${tx.account}-${tx.time}`}
                      className="border-b border-slate-700 hover:bg-slate-700/30"
                    >
                      <td className="py-3 text-sm text-slate-200 font-mono">
                        {tx.account}
                      </td>
                      <td className="py-3 text-sm text-green-400">{tx.type}</td>
                      <td className="py-3 text-sm text-slate-200">
                        {tx.solAmount}
                      </td>
                      <td className="py-3 text-sm text-slate-200">
                        {tx.tokenAmount}K
                      </td>
                      <td className="py-3 text-sm text-slate-200">{tx.time}</td>
                      <td className="py-3 text-sm text-blue-400">
                        <button type="button" className="hover:text-blue-300">
                          <ExternalLink size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "holders" && (
          <div className="bg-slate-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Token Holders</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-sm font-normal text-slate-400 py-2">
                      Rank
                    </th>
                    <th className="text-left text-sm font-normal text-slate-400 py-2">
                      Account
                    </th>
                    <th className="text-right text-sm font-normal text-slate-400 py-2">
                      Balance
                    </th>
                    <th className="text-right text-sm font-normal text-slate-400 py-2">
                      Percentage
                    </th>
                    <th className="text-right text-sm font-normal text-slate-400 py-2">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockHolders.map((holder, index) => (
                    <tr
                      key={`holder-${holder.account}`}
                      className="border-b border-slate-700 hover:bg-slate-700/30"
                    >
                      <td className="py-3 text-sm text-slate-400">
                        #{index + 1}
                      </td>
                      <td className="py-3 text-sm text-slate-200 font-mono">
                        {holder.account}
                      </td>
                      <td className="py-3 text-sm text-slate-200 text-right">
                        {holder.balance.toLocaleString()}
                      </td>
                      <td className="py-3 text-sm text-slate-200 text-right">
                        {holder.percentage}%
                      </td>
                      <td className="py-3 text-sm text-slate-200 text-right">
                        ${holder.value.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Communication panel */}
      <CommunicationPanel />
    </div>
  );
}
