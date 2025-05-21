import type { Transaction } from "@mysten/sui/transactions";
import { GAS_BUDGET } from "./constants";

export const setupTransaction = (tx: Transaction, senderAddress: string) => {
  tx.setSenderIfNotSet(senderAddress);
  tx.setGasBudgetIfNotSet(GAS_BUDGET);
  return tx;
};
