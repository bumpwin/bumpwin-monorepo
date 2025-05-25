"use client";

import { type ReactNode, createContext, useContext, useState } from "react";

type BattleRoundPhase = "daytime" | "darknight";

interface BattleRoundPhaseContextType {
  phase: BattleRoundPhase;
  setPhase: (phase: BattleRoundPhase) => void;
}

const BattleRoundPhaseContext = createContext<
  BattleRoundPhaseContextType | undefined
>(undefined);

export function BattleRoundPhaseProvider({
  children,
}: { children: ReactNode }) {
  const [phase, setPhase] = useState<BattleRoundPhase>("daytime");

  return (
    <BattleRoundPhaseContext.Provider value={{ phase, setPhase }}>
      {children}
    </BattleRoundPhaseContext.Provider>
  );
}

export function useBattleRoundPhase() {
  const context = useContext(BattleRoundPhaseContext);
  if (context === undefined) {
    throw new Error(
      "useBattleRoundPhase must be used within a BattleRoundPhaseProvider",
    );
  }
  return context;
}
