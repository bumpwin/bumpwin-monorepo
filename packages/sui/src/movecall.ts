import type { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { logger } from "@workspace/logger";
import { BumpFamCoin } from "../../bumpwin-pilot/sdk/src/moveCall/bumpFamCoin";
import { isCoinMetadata, isTreasuryCap } from "./utils";

/**
 * Helper function to sign and execute a transaction
 * @param transactionBlock Uint8Array containing the transaction block
 * @param signAndExecuteTransactionFn Function from dapp-kit to sign and execute
 * @returns Transaction digest
 */
export async function signTransactionAndExecute(
  transactionBlock: Uint8Array,
  signAndExecuteTransactionFn: (
    args: { transaction: string },
    options: any,
  ) => void,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      logger.info("Signing transaction...");
      // Convert Uint8Array to Base64 string
      const base64Tx = Buffer.from(transactionBlock).toString("base64");
      signAndExecuteTransactionFn(
        {
          transaction: base64Tx,
        },
        {
          onSuccess: (result: { digest: string }) => {
            logger.info("Transaction successfully executed:", result);
            resolve(result.digest);
          },
          onError: (error: Error) => {
            logger.error("Transaction signing error:", error);
            reject(error);
          },
        },
      );
    } catch (error) {
      logger.error("Error in signAndExecuteTransaction:", error);
      reject(error);
    }
  });
}

/**
 * Fetch object IDs from a transaction digest
 * @param client SuiClient instance
 * @param digest Transaction digest
 * @returns Object containing packageId, coinMetadataID, and treasuryCapID
 */
async function fetchObjectIdsFromTransaction(
  client: SuiClient,
  digest: string,
): Promise<{
  packageId: string;
  coinMetadataID: string;
  treasuryCapID: string;
}> {
  try {
    // Wait a bit for transaction to be indexed
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Fetch transaction block with object changes
    const txBlock = await client.getTransactionBlock({
      digest,
      options: { showEffects: true, showObjectChanges: true },
    });

    // Extract IDs from object changes
    const packageId =
      (txBlock.objectChanges?.find((c) => c.type === "published") as any)
        ?.packageId || "";

    const coinMetadataID =
      (
        txBlock.objectChanges?.find(
          (c) => c.type === "created" && isCoinMetadata(c.objectType),
        ) as any
      )?.objectId || "";

    const treasuryCapID =
      (
        txBlock.objectChanges?.find(
          (c) => c.type === "created" && isTreasuryCap(c.objectType),
        ) as any
      )?.objectId || "";

    logger.info("Extracted object IDs from transaction", {
      packageId,
      coinMetadataID,
      treasuryCapID,
    });

    return { packageId, coinMetadataID, treasuryCapID };
  } catch (error) {
    logger.error("Failed to fetch object IDs from transaction", {
      error,
      digest,
    });
    return { packageId: "", coinMetadataID: "", treasuryCapID: "" };
  }
}

/**
 * Publish BumpFamCoin package to the blockchain
 * @param client SuiClient
 * @param senderAddress Sender address
 * @param signCallback Signature callback function that handles signing AND execution
 * @returns Publication result (packageId, coinMetadataID, treasuryCapID)
 */
export async function publishBumpFamCoinPackage(
  client: SuiClient,
  senderAddress: string,
  signCallback: (transactionBlock: Uint8Array) => Promise<string>,
): Promise<{
  packageId: string;
  coinMetadataID: string;
  treasuryCapID: string;
  digest: string;
}> {
  try {
    const tx = new Transaction();
    tx.setSender(senderAddress);
    tx.setGasBudget(500_000_000);

    BumpFamCoin.publishBumpFamCoinPackage(tx, { sender: senderAddress });

    let builtTx: Uint8Array;
    try {
      builtTx = await tx.build({ client });
      logger.info("Transaction built successfully", { sender: senderAddress });
    } catch (buildError) {
      logger.error("Failed to build transaction", { error: buildError });
      throw {
        type: "transaction_build_error",
        message: "Failed to build transaction",
        details: buildError,
      };
    }

    let txResult: any;
    let digest = "";
    try {
      const txResultStr = await signCallback(builtTx);

      try {
        txResult = JSON.parse(txResultStr);
        logger.info("Transaction signed and executed successfully", {
          digest: txResult.digest,
        });
        digest = txResult.digest;
      } catch (parseError) {
        logger.warn("Received legacy format transaction result", {
          result: txResultStr,
        });
        // Legacy format - just a digest string
        digest = txResultStr;
        txResult = {
          digest: txResultStr,
          packageId: "",
          coinMetadataID: "",
          treasuryCapID: "",
        };
      }
    } catch (signError) {
      logger.error("Failed to sign and execute transaction", {
        error: signError,
      });
      throw {
        type: "transaction_sign_error",
        message: "Failed to sign and execute transaction",
        details: signError,
      };
    }

    // If package info is missing, fetch it from the blockchain
    if (
      !txResult.packageId ||
      !txResult.coinMetadataID ||
      !txResult.treasuryCapID
    ) {
      logger.info("Fetching object IDs from transaction", { digest });
      const objectIds = await fetchObjectIdsFromTransaction(client, digest);

      txResult.packageId = objectIds.packageId;
      txResult.coinMetadataID = objectIds.coinMetadataID;
      txResult.treasuryCapID = objectIds.treasuryCapID;
    }

    const returnValue = {
      packageId: txResult.packageId || "",
      coinMetadataID: txResult.coinMetadataID || "",
      treasuryCapID: txResult.treasuryCapID || "",
      digest,
    };

    // Log the return values
    logger.info("BumpFamCoin package published", {
      packageId: returnValue.packageId,
      coinMetadataID: returnValue.coinMetadataID,
      treasuryCapID: returnValue.treasuryCapID,
      digest: returnValue.digest,
    });

    return returnValue;
  } catch (error) {
    logger.error("Unexpected error during package publishing", { error });
    throw error;
  }
}

/**
 * Create a BumpFamCoin
 * @param client SuiClient
 * @param senderAddress Sender address
 * @param packageId Package ID
 * @param params Coin creation parameters
 * @param signCallback Signature callback function that handles signing AND execution
 * @returns Transaction result
 */
export async function createBumpFamCoin(
  client: SuiClient,
  senderAddress: string,
  packageId: string,
  params: {
    treasuryCapID: string;
    coinMetadataID: string;
    name: string;
    symbol: string;
    description: string;
    iconUrl?: string;
  },
  signCallback: (transactionBlock: Uint8Array) => Promise<string>,
) {
  try {
    const tx = new Transaction();
    tx.setSender(senderAddress);
    tx.setGasBudget(500_000_000);

    BumpFamCoin.createCoin(tx, `${packageId}::bump_fam_coin::BUMP_FAM_COIN`, {
      treasuryCapID: params.treasuryCapID,
      coinMetadataID: params.coinMetadataID,
      name: params.name,
      symbol: params.symbol,
      description: params.description,
      iconUrl: params.iconUrl || null,
    });

    logger.info("Creating BumpFamCoin with params", {
      packageId,
      treasuryCapID: params.treasuryCapID,
      coinMetadataID: params.coinMetadataID,
      name: params.name,
      symbol: params.symbol,
    });

    let builtTx: Uint8Array;
    try {
      builtTx = await tx.build({ client });
      logger.info("Transaction built successfully");
    } catch (buildError) {
      logger.error("Failed to build transaction", { error: buildError });
      throw {
        type: "transaction_build_error",
        message: "Failed to build coin creation transaction",
        details: buildError,
      };
    }

    let txResult: any;
    try {
      const txResultStr = await signCallback(builtTx);

      try {
        txResult = JSON.parse(txResultStr);
        logger.info(
          "Coin creation transaction signed and executed successfully",
          {
            digest: txResult.digest,
          },
        );
      } catch (parseError) {
        logger.warn("Received legacy format transaction result", {
          result: txResultStr,
        });
        txResult = {
          digest: txResultStr,
        };
      }
    } catch (signError) {
      logger.error("Failed to sign transaction", { error: signError });
      throw {
        type: "transaction_sign_error",
        message: "Failed to sign coin creation transaction",
        details: signError,
      };
    }

    const returnValue = {
      digest: txResult.digest,
      result: txResult,
    };

    // Log the coin creation result
    logger.info("BumpFamCoin created", {
      name: params.name,
      symbol: params.symbol,
      digest: returnValue.digest,
      packageId: packageId,
    });

    return returnValue;
  } catch (error) {
    logger.error("Unexpected error during coin creation", {
      error,
      params: {
        packageId,
        name: params.name,
        symbol: params.symbol,
      },
    });
    throw error;
  }
}
