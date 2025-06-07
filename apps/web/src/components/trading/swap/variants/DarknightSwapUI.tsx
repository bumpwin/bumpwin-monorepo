"use client";

import type { CoinMetadata } from "@/app/rounds/types";
import { CoinSelectionModal } from "@/components/trading/CoinSelectionModal";
import { ActionButton } from "@/components/trading/swap/elements/action-button";
import { AmountInput } from "@/components/trading/swap/elements/amount-input";
import { CoinHeader } from "@/components/trading/swap/elements/coin-header";
import { PotentialWinDisplay } from "@/components/trading/swap/elements/potential-win-display";
import { ToggleButton } from "@/components/trading/swap/elements/toggle-button";
import type { ToggleSide } from "@/components/trading/swap/elements/types";
import { CardContent, CardHeader } from "@/components/ui/card";
import { DarkCard } from "@/components/ui/dark-card";
import { useExecuteTransaction } from "@/hooks/transactions/useExecuteTransaction";
import { useTransactionCreators } from "@/hooks/transactions/useTransactionCreators";
import type { UIRoundCoinData } from "@/types/ui-types";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { getSuiBalance } from "@workspace/sui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SwapUIProps {
  coin?: UIRoundCoinData;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceiveCoin, setSelectedReceiveCoin] = useState<CoinMetadata | null>(null);
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

    // For switch transactions, check if receive coin is selected
    if (!isBuy && !selectedReceiveCoin) {
      toast.error("Please select a receive coin first");
      return;
    }

    const tx = createSwapChampTransaction(
      amount,
      isBuy,
      !isBuy ? String(selectedReceiveCoin?.id) : undefined,
    );
    if (!tx) {
      toast.error("Failed to create transaction");
      return;
    }

    await executeTransaction(tx);
  };

  const handleCoinSelection = async (coin: CoinMetadata) => {
    setSelectedReceiveCoin(coin);

    if (!amount || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }

    // Create switch transaction with selected receive coin
    const tx = createSwapChampTransaction(amount, false, String(coin.id));
    if (!tx) {
      toast.error("Failed to create switch transaction");
      return;
    }

    toast.success(`Switch transaction created for ${coin.symbol}`);
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
    <DarkCard className="relative w-full border border-[#2A2F45] bg-gradient-to-b from-[#0F1225] to-[#1A1E32] shadow-[0_8px_32px_rgba(124,58,237,0.15)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:shadow-[0_0_30px_rgba(124,58,237,0.1)]">
      <CardHeader className="">
        <CoinHeader coin={coin} variant={variant} />
      </CardHeader>
      <CardContent>
        {/* Buy/Switch Toggle */}
        <ToggleButton
          activeSide={activeSide}
          onChange={(side: ToggleSide) => setActiveSide(side as "buy" | "switch")}
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
          onReceiveClick={() => setIsModalOpen(true)}
        />

        {/* Selected receive coin display (when switch is active) */}
        {activeSide === "switch" && selectedReceiveCoin && (
          <div className="mb-4 rounded-xl border border-[#3C41FF]/30 bg-[#3C41FF]/10 p-3">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <img
                  src={selectedReceiveCoin.icon}
                  alt={selectedReceiveCoin.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium text-sm text-white">
                  Receive: {selectedReceiveCoin.symbol}
                </div>
                <div className="text-gray-400 text-xs">{selectedReceiveCoin.name}</div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiveCoin(null)}
                className="ml-auto text-gray-400 hover:text-white"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {/* Debug info for testing */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-2 text-gray-400 text-xs">
            Debug: amount={String(amount)}, activeSide={activeSide}, isConnected={String(!!account)}
            , isExecuting={String(isExecuting)}, buttonDisabled=
            {String(activeSide === "buy" ? !amount : false)}
          </div>
        )}

        {/* Action Button */}
        <ActionButton
          activeSide={activeSide}
          isExecuting={isExecuting}
          isConnected={!!account}
          disabled={!amount}
          onClick={() => handleTransaction(activeSide === "buy")}
          variant="darknight"
        />

        {/* Coin Selection Modal */}
        <CoinSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectCoin={handleCoinSelection}
          title="Select Receive Coin"
          description="Choose which coin you want to receive in this sealed switch transaction:"
        />
      </CardContent>
    </DarkCard>
  );
};

export default DarknightSwapUI;
