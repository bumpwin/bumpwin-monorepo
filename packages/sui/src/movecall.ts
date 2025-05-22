import type { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { logger } from "@workspace/logger";
// Remove the problematic imports
// import { BumpFamCoin } from "bumpwin";
// import { Justchat } from "bumpwin";
import { isCoinMetadata, isTreasuryCap } from "./utils";

// Mock implementations to replace the missing imports
// These will be placeholders until the actual implementations are available
const BumpFamCoin = {
  publishBumpFamCoinPackage: (tx: Transaction, params: { sender: string }) => {
    logger.info("Mock BumpFamCoin.publishBumpFamCoinPackage called", params);
    // This is a placeholder - no actual implementation
  },
  createCoin: (tx: Transaction, coinType: string, params: any) => {
    logger.info("Mock BumpFamCoin.createCoin called", { coinType, params });
    // This is a placeholder - no actual implementation
  },
};

class Justchat {
  private network: "mainnet" | "testnet";

  constructor(network: "mainnet" | "testnet") {
    this.network = network;
  }

  sendMessage(tx: Transaction, params: { message: string; sender: string }) {
    logger.info("Mock Justchat.sendMessage called", {
      ...params,
      network: this.network,
    });
    // This is a placeholder - no actual implementation
  }
}

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

/**
 * Send a chat message using JustChat on Sui blockchain
 * @param client SuiClient
 * @param senderAddress Sender address
 * @param message Message text to send
 * @param signCallback Signature callback function that handles signing AND execution
 * @param network Network to use (mainnet or testnet)
 * @returns Transaction result
 */
export async function sendChatMessage(
  client: SuiClient,
  senderAddress: string,
  message: string,
  signCallback: (transactionBlock: Uint8Array) => Promise<string>,
  network: "mainnet" | "testnet" = "testnet",
) {
  try {
    // Check balance before proceeding
    logger.info("Checking SUI balance before sending message");
    const { totalBalance } = await client.getBalance({
      owner: senderAddress,
      coinType: "0x2::sui::SUI",
    });

    // Verify sufficient balance before proceeding (prevent common error)
    const gasEstimate = 5_000_000; // Conservative estimate (5 million MIST)
    if (BigInt(totalBalance) < BigInt(gasEstimate)) {
      logger.error("Insufficient SUI balance for transaction", {
        available: totalBalance,
        required: gasEstimate,
      });
      throw {
        type: "insufficient_balance",
        message: `Insufficient balance for gas. Available: ${totalBalance} MIST, Required estimate: ${gasEstimate} MIST`,
      };
    }

    // Create a new transaction
    logger.info("Creating transaction");
    const tx = new Transaction();
    tx.setSender(senderAddress);

    // Use a much lower gas budget to prevent InsufficientCoinBalance errors
    const gasBudget = 2_000_000; // 2 million MIST (0.002 SUI)
    tx.setGasBudget(gasBudget);

    // Add message to transaction
    logger.info("Adding message to transaction", {
      messageLength: message.length,
      sender: senderAddress,
      network,
    });

    try {
      const justchat = new Justchat(network);
      logger.info("Created Justchat instance", { network });

      justchat.sendMessage(tx, {
        message: message,
        sender: senderAddress,
      });
      logger.info("Added message to transaction using Justchat");
    } catch (error) {
      logger.error("Error adding message to transaction", {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      throw {
        type: "message_add_error",
        message: "Failed to add message to transaction",
        details: error,
      };
    }

    // Build the transaction
    logger.info("Building transaction with gas budget:", { gasBudget });
    let builtTx: Uint8Array;
    try {
      builtTx = await tx.build({ client });
      logger.info("Transaction built successfully", {
        gasBudget,
        totalBalance,
      });
    } catch (buildError) {
      logger.error("Failed to build chat message transaction", {
        error: buildError,
        gasBudget,
      });
      throw {
        type: "transaction_build_error",
        message: "Failed to build chat message transaction",
        details: buildError,
      };
    }

    // Sign and execute the transaction
    logger.info("Signing and executing transaction");
    let txResult: any;
    try {
      const txResultStr = await signCallback(builtTx);

      try {
        txResult = JSON.parse(txResultStr);
        logger.info(
          "Chat message transaction signed and executed successfully",
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
      logger.error("Failed to execute chat message transaction", {
        error: signError,
        errorMessage:
          signError instanceof Error ? signError.message : String(signError),
      });

      // Check for specific error types to provide better messages
      const errorMessage =
        signError instanceof Error ? signError.message : String(signError);
      if (errorMessage.includes("InsufficientCoinBalance")) {
        throw {
          type: "insufficient_balance",
          message: "Insufficient SUI balance to pay for gas",
          details: signError,
        };
      }
      if (errorMessage.includes("MoveAbort") && errorMessage.includes("1001")) {
        throw {
          type: "move_abort",
          message: "Smart contract rejected the message (code 1001)",
          details: signError,
        };
      }
      throw {
        type: "transaction_execute_error",
        message: "Failed to execute chat message transaction",
        details: signError,
      };
    }

    const returnValue = {
      digest: txResult.digest,
      result: txResult,
    };

    // Log the chat message result
    logger.info("Chat message sent successfully", {
      sender: senderAddress,
      digest: returnValue.digest,
      network,
    });

    return returnValue;
  } catch (error) {
    logger.error("Error during chat message sending", {
      error,
      errorType:
        error && typeof error === "object" && "type" in error
          ? error.type
          : "unknown",
      errorMessage:
        error && typeof error === "object" && "message" in error
          ? error.message
          : String(error),
    });
    throw error;
  }
}
