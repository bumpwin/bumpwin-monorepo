"use client";

import { ActionButton } from "@/components/ui/action-button";
import { AmountInput } from "@/components/ui/amount-input";
import { CoinHeader } from "@/components/ui/coin-header";
import { DarkCard } from "@/components/ui/dark-card";
import { PotentialWinDisplay } from "@/components/ui/potential-win-display";
import { ToggleButton } from "@/components/ui/toggle-button";
import { useExecuteTransaction } from "@/hooks/transactions/useExecuteTransaction";
import { useTransactionCreators } from "@/hooks/transactions/useTransactionCreators";
import type { RoundCoin } from "@/types/roundcoin";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { CardContent, CardHeader } from "@workspace/shadcn/components/card";
import { getSuiBalance } from "@workspace/sui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SwapUIProps {
  coin?: RoundCoin;
  variant?: "default" | "champion";
}

const DarknightSwapUI = ({ coin, variant = "default" }: SwapUIProps) => {
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
    <DarkCard className="w-full bg-gradient-to-b from-[#0F1225] to-[#1A1E32] border border-[#2A2F45] shadow-[0_8px_32px_rgba(124,58,237,0.15)] before:absolute before:inset-0 before:rounded-xl before:shadow-[0_0_30px_rgba(124,58,237,0.1)] before:pointer-events-none relative">
      <CardHeader className="">
        <CoinHeader coin={coin} variant={variant} />
      </CardHeader>
      <CardContent>
        {/* Buy/Switch Toggle */}
        <ToggleButton
          activeSide={activeSide}
          onChange={(side) => setActiveSide(side as "buy" | "switch")}
          secondaryOption="switch"
          secondaryColor="violet"
          componentType="darknight"
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
          coin={coin}
          error={errors.amount?.message}
          componentType="darknight"
        />

        {/* Potential Win Section */}
        <PotentialWinDisplay
          amount={amount}
          potentialWin={potentialWin}
          activeSide={activeSide}
          coin={coin}
          avgPrice={avgPrice}
          componentType="darknight"
        />

        {/* Action Button */}
        <ActionButton
          activeSide={activeSide}
          isExecuting={isExecuting}
          isConnected={!!account}
          disabled={!amount}
          onClick={() => handleTransaction(activeSide === "buy")}
          variant="darknight"
        />
      </CardContent>
    </DarkCard>
  );
};

export default DarknightSwapUI;
