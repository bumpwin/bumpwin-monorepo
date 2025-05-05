"use client";

import { Button } from "@workspace/shadcn/components/button";
import { Input } from "@workspace/shadcn/components/input";
import Image from "next/image";
import { useState } from "react";
import type { CoinDetailData } from "../mock/mockCoinDetail";

interface SwapPanelProps {
  coinData: CoinDetailData;
}

export default function SwapPanel({ coinData }: SwapPanelProps) {
  const [amount, setAmount] = useState<string>("1");
  const [slippage, setSlippage] = useState<number>(2.5);
  const [activeAction, setActiveAction] = useState<"buy" | "sell">("buy");

  // Parse input amount to handle numeric values only
  const handleAmountChange = (value: string) => {
    // Allow only numeric input with decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return;
    }
    setAmount(numericValue);
  };

  const totalCost = Number.parseFloat(amount) * coinData.price;
  const formattedTotal = Number.isNaN(totalCost)
    ? "0.00"
    : totalCost.toFixed(4);

  return (
    <div className="flex flex-col bg-slate-800 rounded-lg p-4 h-full">
      {/* Buy/Sell Tabs */}
      <div className="flex mb-4">
        <button
          type="button"
          className={`flex-1 py-2 rounded-l-md transition-colors ${
            activeAction === "buy"
              ? "bg-green-500 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
          onClick={() => setActiveAction("buy")}
        >
          Buy
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded-r-md transition-colors ${
            activeAction === "sell"
              ? "bg-red-500 text-white"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
          }`}
          onClick={() => setActiveAction("sell")}
        >
          Sell
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label
          htmlFor="amount-input"
          className="text-sm text-slate-300 mb-1 block"
        >
          Amount
        </label>
        <div className="relative">
          <Input
            id="amount-input"
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="bg-slate-700 text-white border-slate-600 pl-3 pr-16"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
            <span className="text-sm text-slate-300">SOL</span>
          </div>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[0.1, 0.5, 1, "Max"].map((val) => (
          <button
            key={val.toString()}
            type="button"
            className={`py-1 px-2 text-xs rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors ${
              amount === val.toString() ? "ring-1 ring-blue-500" : ""
            }`}
            onClick={() => setAmount(val.toString())}
          >
            {val} SOL
          </button>
        ))}
      </div>

      {/* Coin Information */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded bg-slate-700">
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            src={coinData.logoUrl}
            alt={coinData.name}
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div>
          <h3 className="font-medium text-white">{coinData.name}</h3>
          <div className="text-xs text-slate-300">{coinData.symbol}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="font-medium text-white">
            ${coinData.price.toFixed(6)}
          </div>
          <div
            className={`text-xs ${coinData.priceChangePercentage24h >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {coinData.priceChangePercentage24h >= 0 ? "+" : ""}
            {coinData.priceChangePercentage24h.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* You Receive */}
      <div className="bg-slate-700 p-3 rounded mb-4">
        <div className="text-sm text-slate-300 mb-1">
          {activeAction === "buy" ? "You receive:" : "You pay:"}
        </div>
        <div className="flex justify-between items-center">
          <div className="font-medium text-white">
            {(Number.parseFloat(amount) / coinData.price).toFixed(6)}{" "}
            {coinData.symbol}
          </div>
          <div className="text-xs text-slate-400">${formattedTotal} USD</div>
        </div>
      </div>

      {/* Slippage */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <label htmlFor="slippage-input" className="text-sm text-slate-300">
            Slippage Tolerance
          </label>
          <span className="text-sm text-white">{slippage}%</span>
        </div>
        <input
          id="slippage-input"
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={slippage}
          onChange={(e) => setSlippage(Number.parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>0.1%</span>
          <span>5%</span>
        </div>
      </div>

      {/* Action Button */}
      <Button
        className={`w-full py-6 text-lg ${
          activeAction === "buy"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {activeAction === "buy" ? "Buy" : "Sell"} {coinData.symbol}
      </Button>

      {/* Additional Information */}
      <div className="mt-4 text-xs text-slate-400 space-y-1">
        <div className="flex justify-between">
          <span>Network Fee</span>
          <span>~0.00025 SOL</span>
        </div>
        <div className="flex justify-between">
          <span>Price Impact</span>
          <span className="text-yellow-400">0.05%</span>
        </div>
        <div className="flex justify-between">
          <span>Minimum Received</span>
          <span>
            {(
              (Number.parseFloat(amount) / coinData.price) *
              (1 - slippage / 100)
            ).toFixed(6)}{" "}
            {coinData.symbol}
          </span>
        </div>
      </div>
    </div>
  );
}
