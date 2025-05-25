import type { ToggleSide } from "@/components/ui/swap/elements/types";
import { ConnectButton } from "@mysten/dapp-kit";
import type { ReactNode } from "react";

interface ActionButtonProps {
  activeSide: ToggleSide;
  isExecuting: boolean;
  isConnected: boolean;
  disabled?: boolean;
  onClick: () => void;
  variant?: "champion" | "default" | "darknight";
}

export const ActionButton = ({
  activeSide,
  isExecuting,
  isConnected,
  disabled = false,
  onClick,
  variant = "default",
}: ActionButtonProps) => {
  // Define button styles based on variant and activeSide
  const getButtonStyle = () => {
    if (variant === "champion") {
      if (activeSide === "buy") {
        return "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-[0_4px_12px_rgba(34,197,94,0.25)]";
      }
      return "bg-gradient-to-r from-[#E41652] to-[#E43571] hover:from-[#D4124E] hover:to-[#D43170] text-white shadow-[0_4px_12px_rgba(255,27,91,0.25)]";
    }

    if (variant === "darknight") {
      return "bg-[#3C41FF] text-white shadow-md";
    }

    // Default style
    if (activeSide === "buy") {
      return "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-[0_4px_12px_rgba(34,197,94,0.25)]";
    }
    return "bg-gradient-to-r from-[#E41652] to-[#E43571] hover:from-[#D4124E] hover:to-[#D43170] text-white shadow-[0_4px_12px_rgba(255,27,91,0.25)]";
  };

  // Get button text based on state and activeSide
  const getButtonText = (): ReactNode => {
    if (isExecuting) {
      return (
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
          {variant === "darknight" ? "Sealing Transaction" : "Processing"}
        </div>
      );
    }

    if (activeSide === "buy") {
      return variant === "darknight" ? "Buy (Sealed)" : "Buy Now";
    }

    if (activeSide === "sell") {
      return "Sell Now";
    }

    return "Switch (Sealed)";
  };

  // If not connected, show connect button instead
  if (!isConnected) {
    return (
      <ConnectButton
        connectText={
          <div className="w-full text-center !text-white font-bold">
            Login to Trade
          </div>
        }
        className={`w-full !py-3.5 !rounded-xl !text-base !transition-all !duration-200 !min-w-0 !h-auto !px-0 !border-none !ring-0 ${
          variant === "darknight"
            ? "!bg-[#3C41FF] !shadow-md"
            : "!bg-gradient-to-r !from-blue-600 !to-blue-500 !hover:from-blue-700 !hover:to-blue-600 !shadow-[0_4px_12px_rgba(0,118,255,0.25)]"
        }`}
      />
    );
  }

  return (
    <button
      type="button"
      className={`w-full py-3.5 font-bold text-base transition-all duration-200 rounded-xl ${getButtonStyle()} disabled:opacity-50 disabled:shadow-none`}
      onClick={onClick}
      disabled={isExecuting || disabled}
    >
      {getButtonText()}
    </button>
  );
};
