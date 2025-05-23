import { GAS_BUDGET } from "@/hooks/transactions/constants";
import type { Transaction } from "@mysten/sui/transactions";

export const setupTransaction = (tx: Transaction, senderAddress: string) => {
  tx.setSenderIfNotSet(senderAddress);
  tx.setGasBudgetIfNotSet(GAS_BUDGET);
  return tx;
};
