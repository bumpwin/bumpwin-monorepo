import { CoinIconSymbol } from "@/components/coins/coin-icon-symbol";
import type { ComponentType, ToggleSide } from "@/components/trading/swap/elements/types";
import type { RoundCoin } from "@/types/roundcoin";
import type { UseFormRegisterReturn } from "react-hook-form";

interface AmountInputProps {
  amount: number | null;
  activeSide: ToggleSide;
  register: UseFormRegisterReturn;
  onAmountChange: (value: string) => void;
  setAmountValue: (val: number | null) => void;
  balance: number;
  coin?: RoundCoin;
  error?: string;
  componentType: ComponentType;
}

export const AmountInput = ({
  amount,
  activeSide,
  register,
  onAmountChange,
  setAmountValue,
  balance,
  coin,
  error,
  componentType,
}: AmountInputProps) => {
  // Determine if we're showing a coin icon based on activeSide and componentType
  const showCoinIcon =
    (componentType === "daytime" && activeSide === "sell") ||
    (componentType === "darknight" && activeSide === "switch") ||
    (componentType === "champion" && activeSide === "sell");

  // Determine if we're showing the SUI label (unit) based on componentType and activeSide
  const showSuiLabel =
    activeSide === "buy" &&
    (componentType === "daytime" || componentType === "darknight" || componentType === "champion");

  // Determine background color based on componentType
  const getBackgroundColor = () => {
    if (componentType === "darknight") {
      return "bg-[#16192C]";
    }
    // 他のコンポーネントは透明背景を維持
    return "bg-transparent";
  };

  return (
    <div className="mb-4">
      <div className="ml-1 font-medium text-gray-400 text-sm">You pay</div>
      <div className="relative mb-3">
        <div
          className={`${getBackgroundColor()} overflow-hidden rounded-2xl text-white shadow-inner`}
        >
          <div className="flex items-baseline px-3">
            {showCoinIcon && coin && (
              <CoinIconSymbol coin={coin} size="sm" className="mr-1 min-w-0 flex-shrink-0" />
            )}
            <input
              type="text"
              {...register}
              value={amount === null ? "" : amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="m-0 w-auto flex-1 border-none bg-transparent p-0 text-right font-bold text-5xl outline-none placeholder:text-gray-500"
              style={{ width: `${String(amount ?? "").length + 1}ch` }}
              placeholder="0"
              autoComplete="off"
            />
            <span
              className={`ml-2 font-bold text-xl select-none${!showSuiLabel ? " invisible" : ""}`}
            >
              SUI
            </span>
          </div>
        </div>
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
      <div className="mb-1 flex justify-end gap-1.5">
        {activeSide === "buy"
          ? [
              { label: "+0.1", value: 0.1 },
              { label: "+1", value: 1 },
              { label: "+10", value: 10 },
            ].map(({ label, value }) => (
              <button
                type="button"
                key={label}
                className="w-auto rounded-xl border border-[#3A3F51] bg-transparent px-3 py-1.5 font-medium text-gray-300 text-sm shadow-none transition-colors hover:bg-[#23262F] hover:text-white"
                onClick={() => setAmountValue(Number(((amount ?? 0) + value).toFixed(2)))}
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
                className="w-auto rounded-xl border border-[#3A3F51] bg-transparent px-3 py-1.5 font-medium text-gray-300 text-sm shadow-none transition-colors hover:bg-[#23262F] hover:text-white"
                onClick={() => setAmountValue(Number(value.toFixed(2)))}
              >
                {label}
              </button>
            ))}
        <button
          type="button"
          className="w-auto rounded-xl border border-[#3A3F51] bg-transparent px-3 py-1.5 font-medium text-gray-300 text-sm shadow-none transition-colors hover:bg-[#23262F] hover:text-white"
          onClick={() => setAmountValue(balance)}
        >
          Max
        </button>
      </div>
    </div>
  );
};
