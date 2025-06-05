"use client";

import LWCChart from "@/components/charts/LWCChart";
import SwapPanel from "@/components/trading/SwapPanel";
import type { CoinDetailData } from "@/lib/tempMockData";
import { formatCurrency } from "@/utils/format";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

export default function CoinDetailClient({ coinData, chartData, round_id }: CoinDetailClientProps) {
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-800">
              <Image
                src={coinData.logoUrl}
                alt={coinData.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-bold text-2xl">{coinData.name}</h1>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs">
                  {coinData.symbol}
                </span>
                <span>Round {round_id}</span>
                <span>Created {createdTimeAgo}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-bold text-2xl">${coinData.price.toFixed(6)}</div>
            <div className={`text-sm ${priceChangeColor}`}>
              {coinData.priceChangePercentage24h >= 0 ? "+" : ""}
              {coinData.priceChangePercentage24h.toFixed(2)}% (24h)
            </div>
          </div>
        </div>

        {/* Price stats */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-slate-800 p-4">
            <div className="mb-1 text-slate-400 text-sm">Market Cap</div>
            <div className="font-semibold text-lg">{formatCurrency(coinData.marketCap)}</div>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <div className="mb-1 text-slate-400 text-sm">24h Volume</div>
            <div className="font-semibold text-lg">{formatCurrency(coinData.volume24h)}</div>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <div className="mb-1 text-slate-400 text-sm">24h High</div>
            <div className="font-semibold text-lg">${coinData.high24h.toFixed(6)}</div>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <div className="mb-1 text-slate-400 text-sm">24h Low</div>
            <div className="font-semibold text-lg">${coinData.low24h.toFixed(6)}</div>
          </div>
        </div>

        {/* Chart and swap container */}
        <div className="flex h-[500px] gap-6">
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
        <div className="mt-6 mb-6 rounded-lg bg-slate-800 p-4">
          <h2 className="mb-2 font-semibold text-lg">About {coinData.name}</h2>
          <p className="text-slate-300">{coinData.description}</p>
        </div>

        {/* Tab navigation */}
        <div className="mb-4">
          <div className="flex w-fit rounded-full bg-slate-800 p-1">
            <button
              type="button"
              className={`rounded-full px-6 py-2 text-sm ${activeTab === "transactions" ? "bg-blue-500 text-white" : "text-slate-300 hover:text-white"}`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </button>
            <button
              type="button"
              className={`rounded-full px-6 py-2 text-sm ${activeTab === "holders" ? "bg-blue-500 text-white" : "text-slate-300 hover:text-white"}`}
              onClick={() => setActiveTab("holders")}
            >
              Holders
            </button>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "transactions" && (
          <div className="rounded-lg bg-slate-800 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-lg">Recent Transactions</h2>
              <div className="flex items-center">
                <label className="mr-6 flex items-center text-slate-300 text-sm">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 rounded border-gray-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                    checked={showMyTransactions}
                    onChange={(e) => setShowMyTransactions(e.target.checked)}
                  />
                  My transactions
                </label>
                <label className="flex items-center text-slate-300 text-sm">
                  <span className="mr-2">Size greater than</span>
                  <input
                    type="text"
                    className="h-8 w-16 rounded border-slate-600 bg-slate-700 px-2 text-white text-xs"
                    placeholder="0.0"
                  />
                  <span className="ml-2">SOL</span>
                </label>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-slate-700 border-b">
                    <th className="py-2 text-left font-normal text-slate-400 text-sm">Account</th>
                    <th className="py-2 text-left font-normal text-slate-400 text-sm">Type</th>
                    <th className="py-2 text-left font-normal text-slate-400 text-sm">
                      SOL Amount
                    </th>
                    <th className="py-2 text-left font-normal text-slate-400 text-sm">
                      Token Amount
                    </th>
                    <th className="py-2 text-left font-normal text-slate-400 text-sm">Time</th>
                    <th className="py-2 text-left font-normal text-slate-400 text-sm">Tx Link</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((tx) => (
                    <tr
                      key={`tx-${tx.account}-${tx.time}`}
                      className="border-slate-700 border-b hover:bg-slate-700/30"
                    >
                      <td className="py-3 font-mono text-slate-200 text-sm">{tx.account}</td>
                      <td className="py-3 text-green-400 text-sm">{tx.type}</td>
                      <td className="py-3 text-slate-200 text-sm">{tx.solAmount}</td>
                      <td className="py-3 text-slate-200 text-sm">{tx.tokenAmount}K</td>
                      <td className="py-3 text-slate-200 text-sm">{tx.time}</td>
                      <td className="py-3 text-blue-400 text-sm">
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
          <div className="rounded-lg bg-slate-800 p-4">
            <h2 className="mb-4 font-semibold text-lg">Token Holders</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-slate-700 border-b">
                    <th className="py-2 text-left font-normal text-slate-400 text-sm">Rank</th>
                    <th className="py-2 text-left font-normal text-slate-400 text-sm">Account</th>
                    <th className="py-2 text-right font-normal text-slate-400 text-sm">Balance</th>
                    <th className="py-2 text-right font-normal text-slate-400 text-sm">
                      Percentage
                    </th>
                    <th className="py-2 text-right font-normal text-slate-400 text-sm">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {mockHolders.map((holder, index) => (
                    <tr
                      key={`holder-${holder.account}`}
                      className="border-slate-700 border-b hover:bg-slate-700/30"
                    >
                      <td className="py-3 text-slate-400 text-sm">#{index + 1}</td>
                      <td className="py-3 font-mono text-slate-200 text-sm">{holder.account}</td>
                      <td className="py-3 text-right text-slate-200 text-sm">
                        {holder.balance.toLocaleString()}
                      </td>
                      <td className="py-3 text-right text-slate-200 text-sm">
                        {holder.percentage}%
                      </td>
                      <td className="py-3 text-right text-slate-200 text-sm">
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
    </div>
  );
}
