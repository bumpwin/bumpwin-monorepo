"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CoinDetailData } from "@/types/coin";
import Image from "next/image";
import { useState } from "react";
import { match } from "ts-pattern";

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
  const formattedTotal = match(Number.isNaN(totalCost))
    .with(true, () => "0.00")
    .with(false, () => totalCost.toFixed(4))
    .exhaustive();

  return (
    <div className="flex h-full flex-col rounded-lg bg-slate-800 p-4">
      {/* Buy/Sell Tabs */}
      <div className="mb-4 flex">
        <button
          type="button"
          className={`flex-1 rounded-l-md py-2 transition-colors ${match(activeAction)
            .with("buy", () => "bg-green-500 text-white")
            .otherwise(() => "bg-slate-700 text-slate-300 hover:bg-slate-600")}`}
          onClick={() => setActiveAction("buy")}
        >
          Buy
        </button>
        <button
          type="button"
          className={`flex-1 rounded-r-md py-2 transition-colors ${match(activeAction)
            .with("sell", () => "bg-red-500 text-white")
            .otherwise(() => "bg-slate-700 text-slate-300 hover:bg-slate-600")}`}
          onClick={() => setActiveAction("sell")}
        >
          Sell
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label htmlFor="amount-input" className="mb-1 block text-slate-300 text-sm">
          Amount
        </label>
        <div className="relative">
          <Input
            id="amount-input"
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="border-slate-600 bg-slate-700 pr-16 pl-3 text-white"
          />
          <div className="-translate-y-1/2 absolute top-1/2 right-2 flex transform items-center">
            <span className="text-slate-300 text-sm">SOL</span>
          </div>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        {[0.1, 0.5, 1, "Max"].map((val) => (
          <button
            key={val.toString()}
            type="button"
            className={`rounded bg-slate-700 px-2 py-1 text-slate-300 text-xs transition-colors hover:bg-slate-600 ${match(
              amount === val.toString(),
            )
              .with(true, () => "ring-1 ring-blue-500")
              .with(false, () => "")
              .exhaustive()}`}
            onClick={() => setAmount(val.toString())}
          >
            {val} SOL
          </button>
        ))}
      </div>

      {/* Coin Information */}
      <div className="mb-4 flex items-center gap-3 rounded bg-slate-700 p-3">
        <div className="relative h-10 w-10 flex-shrink-0">
          <Image
            src={coinData.logoUrl}
            alt={coinData.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-white">{coinData.name}</h3>
          <div className="text-slate-300 text-xs">{coinData.symbol}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="font-medium text-white">${coinData.price.toFixed(6)}</div>
          <div
            className={`text-xs ${match(coinData.priceChangePercentage24h >= 0)
              .with(true, () => "text-green-400")
              .with(false, () => "text-red-400")
              .exhaustive()}`}
          >
            {match(coinData.priceChangePercentage24h >= 0)
              .with(true, () => "+")
              .with(false, () => "")
              .exhaustive()}
            {coinData.priceChangePercentage24h.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* You Receive */}
      <div className="mb-4 rounded bg-slate-700 p-3">
        <div className="mb-1 text-slate-300 text-sm">
          {match(activeAction)
            .with("buy", () => "You receive:")
            .with("sell", () => "You pay:")
            .exhaustive()}
        </div>
        <div className="flex items-center justify-between">
          <div className="font-medium text-white">
            {(Number.parseFloat(amount) / coinData.price).toFixed(6)} {coinData.symbol}
          </div>
          <div className="text-slate-400 text-xs">${formattedTotal} USD</div>
        </div>
      </div>

      {/* Slippage */}
      <div className="mb-6">
        <div className="mb-1 flex justify-between">
          <label htmlFor="slippage-input" className="text-slate-300 text-sm">
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
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700"
        />
        <div className="flex justify-between text-slate-400 text-xs">
          <span>0.1%</span>
          <span>5%</span>
        </div>
      </div>

      {/* Action Button */}
      <Button
        className={`w-full py-6 text-lg ${match(activeAction)
          .with("buy", () => "bg-green-500 hover:bg-green-600")
          .with("sell", () => "bg-red-500 hover:bg-red-600")
          .exhaustive()}`}
      >
        {match(activeAction)
          .with("buy", () => "Buy")
          .with("sell", () => "Sell")
          .exhaustive()}{" "}
        {coinData.symbol}
      </Button>

      {/* Additional Information */}
      <div className="mt-4 space-y-1 text-slate-400 text-xs">
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
            {((Number.parseFloat(amount) / coinData.price) * (1 - slippage / 100)).toFixed(6)}{" "}
            {coinData.symbol}
          </span>
        </div>
      </div>
    </div>
  );
}
