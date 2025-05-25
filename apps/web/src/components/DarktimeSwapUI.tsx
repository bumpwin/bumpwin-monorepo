"use client";

import { DarkCard } from "@/components/ui/dark-card";
import { useExecuteTransaction } from "@/hooks/transactions/useExecuteTransaction";
import { useTransactionCreators } from "@/hooks/transactions/useTransactionCreators";
import type { RoundCoin } from "@/types/roundcoin";
import {
  ConnectButton,
  useCurrentAccount,
  useSuiClient,
} from "@mysten/dapp-kit";
import { CardContent, CardHeader } from "@workspace/shadcn/components/card";
import { getSuiBalance } from "@workspace/sui";
import { AnimatePresence, motion } from "framer-motion";
import { Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SwapUIProps {
  coin?: RoundCoin;
  variant?: "default" | "champion";
}

const SwapUI = ({ coin, variant = "default" }: SwapUIProps) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{ amount: number | null }>({
    defaultValues: { amount: null },
  });
  const amount = watch("amount");
  const [balance, setBalance] = useState<number>(0);
  const [potentialWin, setPotentialWin] = useState<number>(0);
  const [avgPrice] = useState<number>(17.6);
  const [activeSide, setActiveSide] = useState<"buy" | "switch">("buy");
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { createSwapChampTransaction } = useTransactionCreators();
  const { executeTransaction, isExecuting } = useExecuteTransaction();

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const bal = await getSuiBalance(suiClient, account.address);
        setBalance(Number(bal));
      }
    };
    fetchBalance();
  }, [account, suiClient]);

  useEffect(() => {
    // Calculate potential win based on amount and current price
    if (amount) {
      setPotentialWin(amount * 5.68);
    } else {
      setPotentialWin(0);
    }
  }, [amount]);

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

  const setAmountValue = (val: number | null) => setValue("amount", val);

  const handleAmountChange = (value: string) => {
    if (value === "") {
      setAmountValue(null);
      return;
    }
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) return;
    setAmountValue(Number(value));
  };

  if (!coin) return null;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-gradient-to-b from-[#0F1225] to-[#1A1E32] rounded-2xl p-5 shadow-xl border border-[#2A2F45]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`relative w-12 h-12 rounded-xl overflow-hidden ${
              variant === "champion"
                ? "border border-yellow-400/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                : "border border-purple-500/20 shadow-[0_0_15px_rgba(149,76,233,0.1)]"
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
              className={`font-bold text-xl truncate ${
                variant === "champion"
                  ? "text-yellow-400 drop-shadow-[0_0_5px_rgba(255,215,0,0.2)]"
                  : "text-white"
              }`}
            >
              {coin.name}
            </div>
          </div>
        </div>

        {/* Buy/Switch Toggle */}
        <div className="flex p-1 mb-3 bg-[#16192C] rounded-full">
          <button
            type="button"
            onClick={() => setActiveSide("buy")}
            className={`flex-1 py-2 font-bold text-base transition-all duration-200 rounded-full ${
              activeSide === "buy"
                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                : "text-gray-400 hover:bg-green-500/20 hover:text-green-400"
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setActiveSide("switch")}
            className={`flex-1 py-2 font-bold text-base transition-all duration-200 rounded-full ${
              activeSide === "switch"
                ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                : "text-gray-400 hover:bg-purple-500/20 hover:text-purple-400"
            }`}
          >
            Switch
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <div className="text-gray-400 font-medium text-sm ml-1">You pay</div>
          <div className="relative mb-3">
            <div className="bg-[#16192C] rounded-2xl overflow-hidden shadow-inner text-white">
              <div className="flex items-baseline px-3">
                {activeSide === "switch" && (
                  <div className="flex items-center gap-2 mr-1 min-w-0 flex-shrink-0">
                    <div className="w-7 h-7 relative overflow-hidden rounded-lg">
                      <Image
                        src={coin.iconUrl}
                        alt={coin.symbol}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <span className="font-bold text-lg text-white select-none truncate">
                      {coin.symbol}
                    </span>
                  </div>
                )}
                <input
                  type="text"
                  {...register("amount", {
                    valueAsNumber: true,
                    min: { value: 0, message: "0以上を入力してください" },
                    validate: (v) => v === null || !Number.isNaN(v),
                  })}
                  value={amount === null ? "" : amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="bg-transparent border-none outline-none text-5xl font-bold text-right w-auto p-0 m-0 placeholder:text-gray-500 flex-1"
                  style={{ width: `${String(amount ?? "").length + 1}ch` }}
                  placeholder="0"
                  autoComplete="off"
                />
                <span
                  className={`ml-2 text-xl font-bold select-none${activeSide === "switch" ? " invisible" : ""}`}
                >
                  SUI
                </span>
              </div>
            </div>
          </div>
          {errors.amount && (
            <span className="text-red-500 text-xs">
              {errors.amount.message}
            </span>
          )}
          <div className="flex justify-end gap-1.5 mb-1">
            {activeSide === "buy"
              ? [
                  { label: "+0.1", value: 0.1 },
                  { label: "+1", value: 1 },
                  { label: "+10", value: 10 },
                ].map(({ label, value }) => (
                  <button
                    type="button"
                    key={label}
                    className="w-auto px-3 bg-[#20243A] text-gray-300 border-none rounded-xl py-1.5 text-sm font-medium hover:bg-[#282D45] hover:text-white transition-colors shadow-none"
                    onClick={() =>
                      setAmountValue(Number(((amount ?? 0) + value).toFixed(2)))
                    }
                  >
                    {label}
                  </button>
                ))
              : [
                  { label: "25%", value: balance * 0.25 },
                  { label: "50%", value: balance * 0.5 },
                ].map(({ label, value }) => (
                  <button
                    type="button"
                    key={label}
                    className="w-auto px-3 bg-[#20243A] text-gray-300 border-none rounded-xl py-1.5 text-sm font-medium hover:bg-[#282D45] hover:text-white transition-colors shadow-none"
                    onClick={() => setAmountValue(Number(value.toFixed(2)))}
                  >
                    {label}
                  </button>
                ))}
            <button
              type="button"
              className="w-auto px-3 bg-[#20243A] text-gray-300 border-none rounded-xl py-1.5 text-sm font-medium hover:bg-[#282D45] hover:text-white transition-colors shadow-none"
              onClick={() => setAmountValue(balance)}
            >
              Max
            </button>
          </div>
        </div>

        {/* Potential Win Section - Animated */}
        <AnimatePresence>
          {amount && amount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                duration: 0.3,
              }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#2D3244] py-4 mb-4">
                <div className="flex justify-between items-center cursor-not-allowed">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium">
                      {activeSide === "buy" ? "To win 🌻" : "To receive"}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-end px-3">
                    <span className="text-[#00E065] text-4xl font-bold">
                      {potentialWin.toFixed(2)}
                    </span>
                    <span className="ml-2 text-[#00E065] text-xl font-bold select-none">
                      SUI
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1.5 text-gray-500 text-xs cursor-not-allowed">
                  <span>Avg. Price {avgPrice.toFixed(1)}¢</span>
                  <Info className="h-3 w-3 cursor-not-allowed" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        {account ? (
          <button
            type="button"
            className={`w-full py-3.5 font-bold text-base transition-all duration-200 rounded-xl ${
              activeSide === "buy"
                ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-[0_4px_12px_rgba(34,197,94,0.25)]"
                : "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-[0_4px_12px_rgba(149,76,233,0.25)]"
            } disabled:opacity-50 disabled:shadow-none`}
            onClick={() => handleTransaction(activeSide === "buy")}
            disabled={isExecuting || !amount}
          >
            {isExecuting ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing
              </div>
            ) : activeSide === "buy" ? (
              "Buy Now"
            ) : (
              "Switch Now"
            )}
          </button>
        ) : (
          <ConnectButton
            connectText={
              <div className="w-full text-center !text-white font-bold">
                Login to Trade
              </div>
            }
            className="w-full !bg-gradient-to-r !from-blue-600 !to-blue-500 !hover:from-blue-700 !hover:to-blue-600 !text-white !py-3.5 !rounded-xl !text-base !transition-all !duration-200 !min-w-0 !h-auto !px-0 !border-none !shadow-[0_4px_12px_rgba(0,118,255,0.25)] !ring-0"
          />
        )}
      </div>
    </div>
  );
};

export default SwapUI;
