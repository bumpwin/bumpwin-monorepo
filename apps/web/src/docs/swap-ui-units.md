# SwapUI Components Unit Display Specification

This document outlines the unit display rules for the various SwapUI components in the application.

## Overview

Each SwapUI component has specific rules for when to display unit symbols (SUI) and when to hide them, depending on the component type and active side (buy/sell/switch).

## Unit Display Rules

### DaytimeSwapUI

| State | Input Field | Result Field | Label Text | Special Styling                                  |
|-------|-------------|--------------|------------|-------------------------------------------------|
| Buy   | SUI         | SUI          | To win 🌻  | Label on left, green amount + SUI on right      |
| Sell  | No unit     | SUI          | To receive | -                                               |

### DarknightSwapUI

| State  | Input Field | Result Field | Label Text |
|--------|-------------|--------------|------------|
| Buy    | SUI         | No unit      | To win 🌻  |
| Switch | No unit     | No unit      | To receive |

### ChampionSwapUI

| State | Input Field | Result Field | Label Text |
|-------|-------------|--------------|------------|
| Buy   | SUI         | No unit      | To receive |
| Sell  | No unit     | SUI          | To receive |

## Implementation

These rules are implemented in the `AmountInput` and `PotentialWinDisplay` components, which use the `componentType` prop to determine the appropriate display logic.

```typescript
// Example from AmountInput.tsx
const showSuiLabel = (() => {
  if (componentType === "daytime") {
    return activeSide === "buy";
  }
  if (componentType === "darknight") {
    return activeSide === "buy";
  }
  if (componentType === "champion") {
    return activeSide === "buy";
  }
  return false;
})();

// Example from PotentialWinDisplay.tsx
const showUnitSymbol = (() => {
  if (componentType === "daytime") {
    return true; // Always show SUI
  }
  if (componentType === "darknight") {
    return false; // Never show unit
  }
  if (componentType === "champion") {
    if (activeSide === "sell") {
      return true; // Show SUI for sell
    }
    return false; // No unit for buy
  }
  return true;
})();

// Label text logic
const labelText = (() => {
  if (componentType === "champion" && activeSide === "buy") {
    return "To receive";
  }

  return activeSide === "buy" ? "To win 🌻" : "To receive";
})();

// Special case for Daytime.buy
const isDaytimeBuy = componentType === "daytime" && activeSide === "buy";
const amountTextColor = isDaytimeBuy ? "text-[#00E065]" : "text-white";

// Layout example for DaytimeSwapUI
<div className="flex justify-between items-center">
  <div className="flex items-center gap-2">
    <span className="text-gray-400 font-medium">
      {labelText}
    </span>
  </div>
  <div className="flex items-baseline justify-end px-3">
    <span className={`${amountTextColor} text-4xl font-bold`}>
      {potentialWin.toFixed(2)}
    </span>
    <span className={`ml-2 ${amountTextColor} text-xl font-bold select-none`}>
      {displayCoin.symbol}
    </span>
  </div>
</div>
```

## Visual Reference

You can see these rules implemented in the following components:

- `apps/web/src/components/DaytimeSwapUI.tsx`
- `apps/web/src/components/DarknightSwapUI.tsx`
- `apps/web/src/components/ChampionSwapUI.tsx`
