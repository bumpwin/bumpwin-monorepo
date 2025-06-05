// Core export
export { default as SwapUI } from "@/components/trading/swap/core/SwapUI";

// Variant exports
export { default as DaytimeSwapUI } from "@/components/trading/swap/variants/DaytimeSwapUI";
export { default as DarknightSwapUI } from "@/components/trading/swap/variants/DarknightSwapUI";
export { default as ChampionSwapUI } from "@/components/trading/swap/variants/ChampionSwapUI";

// Elements exports
export { AmountInput } from "@/components/trading/swap/elements/amount-input";
export { PotentialWinDisplay } from "@/components/trading/swap/elements/potential-win-display";
export { ToggleButton } from "@/components/trading/swap/elements/toggle-button";
export { ActionButton } from "@/components/trading/swap/elements/action-button";
export { CoinHeader } from "@/components/trading/swap/elements/coin-header";

// Types exports
export type {
  ComponentType,
  ToggleSide,
} from "@/components/trading/swap/elements/types";
