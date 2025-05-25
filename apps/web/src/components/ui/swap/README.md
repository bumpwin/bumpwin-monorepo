# SwapUI Component Organization

This directory contains all components related to the Swap UI functionality in the BUMPWIN application.

## Structure

- `core/` - Core swap components that are shared across variants
  - `SwapUI.tsx` - Main entry component that decides which variant to display
- `variants/` - Different SwapUI variant implementations
  - `DaytimeSwapUI.tsx` - The daytime variant of the SwapUI
  - `DarknightSwapUI.tsx` - The darknight variant of the SwapUI
  - `ChampionSwapUI.tsx` - The champion variant of the SwapUI
- `elements/` - UI elements specific to swap functionality
  - `amount-input.tsx` - Amount input component
  - `potential-win-display.tsx` - Display for potential win amounts
  - `toggle-button.tsx` - Toggle button for buy/sell actions
  - `action-button.tsx` - Action button for executing transactions
  - `coin-header.tsx` - Header component for displaying coin information

## Unit Display Rules

Each SwapUI variant has specific rules for when to display unit symbols:

### DaytimeSwapUI

| State | Input Field | Result Field | Label Text |
|-------|-------------|--------------|------------|
| Buy   | SUI         | SUI          | To win 🌻  |
| Sell  | No unit     | SUI          | To receive |

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
