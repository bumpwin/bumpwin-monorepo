"use client";

import type { MemeMetadata } from "@workspace/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AmountInput } from "../elements/amount-input";
import { CoinHeader } from "../elements/coin-header";
import { PotentialWinDisplay } from "../elements/potential-win-display";
import type { ComponentType, ToggleSide } from "../elements/types";

interface SwapUIProps {
  coin?: MemeMetadata & { round?: number };
  className?: string;
  componentType?: ComponentType;
}

const SwapUI = ({
  coin,
  className = "",
  componentType = "daytime",
}: SwapUIProps) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [activeSide] = useState<ToggleSide>("buy");
  const [balance] = useState(100); // Mock balance

  const { register: registerAmount } = useForm({
    defaultValues: {
      amount: "",
    },
  });

  const handleAmountChange = (value: string) => {
    const numValue = value === "" ? null : Number(value);
    setAmount(numValue);
  };

  const setAmountValue = (val: number | null) => {
    setAmount(val);
  };

  if (!coin) return null;

  // Mock values for potential win and average price
  const potentialWin = amount ? amount * 1.5 : 0;
  const avgPrice = 0.5;

  return (
    <div className={`space-y-4 ${className}`}>
      <CoinHeader coin={coin} />
      <AmountInput
        amount={amount}
        activeSide={activeSide}
        register={registerAmount("amount")}
        onAmountChange={handleAmountChange}
        setAmountValue={setAmountValue}
        balance={balance}
        coin={coin}
        componentType={componentType}
      />
      <PotentialWinDisplay
        amount={amount}
        potentialWin={potentialWin}
        activeSide={activeSide}
        coin={coin}
        avgPrice={avgPrice}
        componentType={componentType}
      />
    </div>
  );
};

export default SwapUI;
