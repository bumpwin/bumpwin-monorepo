"use client";

import { DarkCard } from "@/components/ui/dark-card";
import { ActionButton } from "@/components/ui/swap/elements/action-button";
import { AmountInput } from "@/components/ui/swap/elements/amount-input";
import { CoinHeader } from "@/components/ui/swap/elements/coin-header";
import { PotentialWinDisplay } from "@/components/ui/swap/elements/potential-win-display";
import { ToggleButton } from "@/components/ui/swap/elements/toggle-button";
import type { ToggleSide } from "@/components/ui/swap/elements/types";
import { useExecuteTransaction } from "@/hooks/transactions/useExecuteTransaction";
import { useTransactionCreators } from "@/hooks/transactions/useTransactionCreators";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { CardContent, CardHeader } from "@workspace/shadcn/components/card";
import { getSuiBalance } from "@workspace/sui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

interface SwapUIProps {
  coin?: CoinWithMarketData;
  variant?: "default" | "champion";
}

const DaytimeSwapUI = ({ coin, variant = "default" }: SwapUIProps) => {
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
  const [activeSide, setActiveSide] = useState<"buy" | "sell">("buy");
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
    <DarkCard className="w-full">
      <CardHeader className="">
        <CoinHeader
          coin={{ ...coin, id: String(coin.id), iconUrl: coin.icon, round: 1 }}
          variant={variant}
        />
      </CardHeader>
      <CardContent>
        {/* Buy/Sell Toggle */}
        <ToggleButton
          activeSide={activeSide}
          onChange={(side: ToggleSide) => setActiveSide(side as "buy" | "sell")}
          secondaryOption="sell"
          secondaryColor="red"
          componentType="daytime"
        />

        {/* Amount Input */}
        <AmountInput
          amount={amount}
          activeSide={activeSide}
          register={register("amount", {
            valueAsNumber: true,
            min: { value: 0, message: "0以上を入力してください" },
            validate: (v) => v === null || !Number.isNaN(v),
          })}
          onAmountChange={handleAmountChange}
          setAmountValue={setAmountValue}
          balance={balance}
          coin={{ ...coin, id: String(coin.id), iconUrl: coin.icon, round: 1 }}
          error={errors.amount?.message}
          componentType="daytime"
        />

        {/* Potential Win Section */}
        <PotentialWinDisplay
          amount={amount}
          potentialWin={potentialWin}
          activeSide={activeSide}
          coin={{ ...coin, id: String(coin.id), iconUrl: coin.icon, round: 1 }}
          avgPrice={avgPrice}
          componentType="daytime"
        />

        {/* Action Button */}
        <ActionButton
          activeSide={activeSide}
          isExecuting={isExecuting}
          isConnected={!!account}
          disabled={!amount}
          onClick={() => handleTransaction(activeSide === "buy")}
          variant={variant}
        />
      </CardContent>
    </DarkCard>
  );
};

export default DaytimeSwapUI;
