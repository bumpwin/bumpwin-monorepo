import type { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { logger } from "@workspace/logger";
import { SUI_BASE_UNIT, SUI_TYPE } from "./constants";

/**
 * Get SUI balance for a wallet address
 * @param suiClient - SUI client instance
 * @param address - Wallet address
 * @returns Formatted balance string with 3 decimal places
 */
export async function getSuiBalance(
  suiClient: SuiClient,
  address: string,
): Promise<string> {
  try {
    const { totalBalance } = await suiClient.getBalance({
      owner: address,
      coinType: SUI_TYPE,
    });
    // Format balance
    return formatSuiBalance(totalBalance);
  } catch (error) {
    logger.error("[Sui] Failed to fetch SUI balance", { error });
    return "Error";
  }
}

/**
 * Format SUI balance from base units to display format
 * @param balance - Balance in base units
 * @returns Formatted balance string with 3 decimal places
 */
export function formatSuiBalance(balance: bigint | string): string {
  return (Number(balance) / SUI_BASE_UNIT).toFixed(3);
}

/**
 * Interface for coin creation parameters
 */
export interface CreateCoinParams {
  packageId: string;
  treasuryCapID: string;
  coinMetadataID: string;
  name: string;
  symbol: string;
  description: string;
  iconUrl: string;
  senderAddress: string;
}

/**
 * Creates a new coin using the OozeFam package
 * @param suiClient - SUI client instance
 * @param params - Coin creation parameters
 * @returns Transaction object that can be signed and executed
 */
export async function createCoin(
  suiClient: SuiClient,
  params: CreateCoinParams,
): Promise<Transaction> {
  try {
    logger.info("[Sui] Creating new coin", { params });

    const tx = new Transaction();
    tx.setSender(params.senderAddress);
    tx.setGasBudget(1_000_000_000);

    // Create coin using the published OozeFam package
    const coinType = `${params.packageId}::ooze_fam_coin::OOZE_FAM_COIN`;

    tx.moveCall({
      target: `${params.packageId}::ooze_fam_coin::create`,
      arguments: [
        tx.object(params.treasuryCapID),
        tx.object(params.coinMetadataID),
        tx.pure.string(params.name),
        tx.pure.string(params.symbol),
        tx.pure.string(params.description),
        tx.pure.string(params.iconUrl),
      ],
    });

    return tx;
  } catch (error) {
    logger.error("[Sui] Failed to create coin transaction", { error });
    throw error;
  }
}
