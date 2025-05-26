import { CoinIconSymbol } from "@/components/ui/coin-icon-symbol";
import type {
  ComponentType,
  ToggleSide,
} from "@/components/ui/swap/elements/types";
import type { BattleCoin } from "@/types/battle";
import type { UseFormRegisterReturn } from "react-hook-form";
import { match } from "ts-pattern";

interface AmountInputProps {
  amount: number | null;
  activeSide: ToggleSide;
  register: UseFormRegisterReturn;
  onAmountChange: (value: string) => void;
  setAmountValue: (val: number | null) => void;
  balance: number;
  coin?: BattleCoin;
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
  const showCoinIcon = match({ componentType, activeSide })
    .with({ componentType: "daytime", activeSide: "sell" }, () => true)
    .with({ componentType: "darknight", activeSide: "switch" }, () => true)
    .with({ componentType: "champion", activeSide: "sell" }, () => true)
    .otherwise(() => false);

  // Determine if we're showing the SUI label (unit) based on componentType and activeSide
  const showSuiLabel = match({ componentType, activeSide })
    .with({ componentType: "daytime", activeSide: "buy" }, () => true)
    .with({ componentType: "darknight", activeSide: "buy" }, () => true)
    .with({ componentType: "champion", activeSide: "buy" }, () => true)
    .otherwise(() => false);

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
      <div className="text-gray-400 font-medium text-sm ml-1">You pay</div>
      <div className="relative mb-3">
        <div
          className={`${getBackgroundColor()} rounded-2xl overflow-hidden shadow-inner text-white`}
        >
          <div className="flex items-baseline px-3">
            {showCoinIcon && coin && (
              <div className="mr-1 min-w-0 flex-shrink-0">
                <CoinIconSymbol coin={coin} size={24} />
              </div>
            )}
            <input
              type="text"
              {...register}
              value={amount === null ? "" : amount}
              onChange={(e) => onAmountChange(e.target.value)}
              className="bg-transparent border-none outline-none text-5xl font-bold text-right w-auto p-0 m-0 placeholder:text-gray-500 flex-1"
              style={{ width: `${String(amount ?? "").length + 1}ch` }}
              placeholder="0"
              autoComplete="off"
            />
            <span
              className={`ml-2 text-xl font-bold select-none${!showSuiLabel ? " invisible" : ""}`}
            >
              SUI
            </span>
          </div>
        </div>
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
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
                className="w-auto px-3 bg-transparent text-gray-300 border border-[#3A3F51] rounded-xl py-1.5 text-sm font-medium hover:bg-[#23262F] hover:text-white transition-colors shadow-none"
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
                className="w-auto px-3 bg-transparent text-gray-300 border border-[#3A3F51] rounded-xl py-1.5 text-sm font-medium hover:bg-[#23262F] hover:text-white transition-colors shadow-none"
                onClick={() => setAmountValue(Number(value.toFixed(2)))}
              >
                {label}
              </button>
            ))}
        <button
          type="button"
          className="w-auto px-3 bg-transparent text-gray-300 border border-[#3A3F51] rounded-xl py-1.5 text-sm font-medium hover:bg-[#23262F] hover:text-white transition-colors shadow-none"
          onClick={() => setAmountValue(balance)}
        >
          Max
        </button>
      </div>
    </div>
  );
};
