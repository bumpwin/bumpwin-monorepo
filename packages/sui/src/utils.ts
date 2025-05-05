import type { SuiClient } from "@mysten/sui/client";
import { logger } from "@workspace/logger";
import { SUI_BASE_UNIT, SUI_TYPE } from "./constants";
import { NETWORK_TYPE } from "./config";

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

export function isCoinMetadata(objectType: string): boolean {
  return objectType.includes('0x2::coin::CoinMetadata');
}

export function isTreasuryCap(objectType: string): boolean {
  return objectType.includes('0x2::coin::TreasuryCap');
}

/**
 * Generate SuiScan URL for a wallet address
 * @param address - Wallet address
 * @param network - Network type (defaults to config NETWORK_TYPE)
 * @returns SuiScan URL for the address
 */
export function getSuiScanUrl(address: string, network: string = NETWORK_TYPE): string {
  return `https://suiscan.xyz/${network}/account/${address}`;
}

/**
 * Generate SuiScan URL for a transaction
 * @param digest - Transaction digest
 * @param network - Network type (defaults to config NETWORK_TYPE)
 * @returns SuiScan URL for the transaction
 */
export function getSuiScanTxUrl(digest: string, network: string = NETWORK_TYPE): string {
  return `https://suiscan.xyz/${network}/tx/${digest}`;
}

/**
 * Generate SuiScan URL for an object details page
 * @param objectId - Object ID
 * @param network - Network type (defaults to config NETWORK_TYPE)
 * @returns SuiScan URL for the object
 */
export function getSuiScanObjectUrl(
  objectId: string,
  network: string = NETWORK_TYPE,
): string {
  return `https://suiscan.xyz/${network}/object/${objectId}`;
}
