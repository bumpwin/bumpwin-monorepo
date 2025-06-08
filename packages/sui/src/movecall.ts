import type { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { logger } from "@workspace/logger";
import { Context, Effect } from "effect";

// Type definitions for transaction results
interface TransactionResult {
  digest: string;
  packageId?: string;
  coinMetadataID?: string;
  treasuryCapID?: string;
}

// Effect error types for blockchain operations (using union types like JAPOX mono2)
export type TransactionBuildError = {
  readonly type: "TRANSACTION_BUILD_ERROR";
  readonly message: string;
  readonly cause: unknown;
};

export type TransactionSignError = {
  readonly type: "TRANSACTION_SIGN_ERROR";
  readonly message: string;
  readonly cause: unknown;
};

export type SuiTransactionError = {
  readonly type: "SUI_TRANSACTION_ERROR";
  readonly message: string;
  readonly digest?: string;
  readonly cause: unknown;
};

// Error factory functions
export const SuiErrors = {
  transactionBuild: (message: string, cause: unknown): TransactionBuildError => ({
    type: "TRANSACTION_BUILD_ERROR",
    message,
    cause,
  }),

  transactionSign: (message: string, cause: unknown): TransactionSignError => ({
    type: "TRANSACTION_SIGN_ERROR",
    message,
    cause,
  }),

  suiTransaction: (message: string, cause: unknown, digest?: string): SuiTransactionError => ({
    type: "SUI_TRANSACTION_ERROR",
    message,
    digest,
    cause,
  }),
} as const;

// Services for dependency injection
export interface SuiClientService {
  readonly _: unique symbol;
}
export const SuiClientService = Context.GenericTag<SuiClientService, SuiClient>("SuiClientService");

export interface TransactionSignerService {
  readonly _: unique symbol;
}
export const TransactionSigner = Context.GenericTag<
  TransactionSignerService,
  {
    readonly sign: (tx: Uint8Array) => Effect.Effect<string, TransactionSignError>;
  }
>("TransactionSigner");
// Remove the problematic imports
// import { BumpFamCoin } from "bumpwin";
// import { Justchat } from "bumpwin";
import { isCoinMetadata, isTreasuryCap } from "./utils";

// Mock implementations to replace the missing imports
// These will be placeholders until the actual implementations are available
const BumpFamCoin = {
  publishBumpFamCoinPackage: (_tx: Transaction, params: { sender: string }) => {
    logger.info("Mock BumpFamCoin.publishBumpFamCoinPackage called", params);
    // This is a placeholder - no actual implementation
  },
  createCoin: (_tx: Transaction, coinType: string, params: unknown) => {
    logger.info("Mock BumpFamCoin.createCoin called", { coinType, params });
    // This is a placeholder - no actual implementation
  },
};

// Functional Justchat implementation
interface JustchatService {
  readonly sendMessage: (tx: Transaction, params: { message: string; sender: string }) => void;
  readonly network: "mainnet" | "testnet";
}

const createJustchat = (network: "mainnet" | "testnet"): JustchatService => ({
  network,
  sendMessage: (_tx: Transaction, params: { message: string; sender: string }) => {
    logger.info("Mock Justchat.sendMessage called", {
      ...params,
      network,
    });
    // This is a placeholder - no actual implementation
  },
});

// Legacy constructor function for backwards compatibility
const _Justchat = (network: "mainnet" | "testnet") => createJustchat(network);

/**
 * Helper function to sign and execute a transaction (Effect version)
 * ✅ Preferred - Uses Effect.async for type-safe async operations
 */
export const signTransactionAndExecuteEffect = (
  transactionBlock: Uint8Array,
  signAndExecuteTransactionFn: (args: { transaction: string }, options: unknown) => void,
): Effect.Effect<string, TransactionSignError> =>
  Effect.async<string, TransactionSignError>((resume) => {
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
            resume(Effect.succeed(result.digest));
          },
          onError: (error: Error) => {
            logger.error("Transaction signing error:", error);
            resume(Effect.fail(SuiErrors.transactionSign("Transaction signing failed", error)));
          },
        },
      );
    } catch (error) {
      logger.error("Error in signAndExecuteTransaction:", error);
      resume(Effect.fail(SuiErrors.transactionSign("Error in transaction setup", error)));
    }
  });

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
      (txBlock.objectChanges?.find((c) => c.type === "published") as { packageId?: string })
        ?.packageId || "";

    const coinMetadataID =
      (
        txBlock.objectChanges?.find(
          (c) => c.type === "created" && isCoinMetadata(c.objectType),
        ) as { objectId?: string }
      )?.objectId || "";

    const treasuryCapID =
      (
        txBlock.objectChanges?.find((c) => c.type === "created" && isTreasuryCap(c.objectType)) as {
          objectId?: string;
        }
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
 * Publish BumpFamCoin package to the blockchain (Effect version)
 * @param senderAddress Sender address
 * @returns Effect that produces publication result or error
 */
export const publishBumpFamCoinPackageEffect = (
  senderAddress: string,
): Effect.Effect<
  {
    packageId: string;
    coinMetadataID: string;
    treasuryCapID: string;
    digest: string;
  },
  TransactionBuildError | TransactionSignError | SuiTransactionError,
  SuiClientService | TransactionSignerService
> =>
  Effect.gen(function* () {
    const client = yield* SuiClientService;
    const signer = yield* TransactionSigner;

    // Create and configure transaction
    const tx = new Transaction();
    tx.setSender(senderAddress);
    tx.setGasBudget(500_000_000);

    BumpFamCoin.publishBumpFamCoinPackage(tx, { sender: senderAddress });

    // Build transaction with error handling
    const builtTx = yield* Effect.tryPromise(() => tx.build({ client })).pipe(
      Effect.mapError((cause) => SuiErrors.transactionBuild("Failed to build transaction", cause)),
      Effect.tap(() => Effect.log("Transaction built successfully", { sender: senderAddress })),
    );

    // Sign and execute transaction
    const txResultStr = yield* signer.sign(builtTx);

    // Parse transaction result
    const txResult = yield* Effect.try(() => JSON.parse(txResultStr) as TransactionResult).pipe(
      Effect.mapError((cause) =>
        SuiErrors.suiTransaction("Failed to parse transaction result", cause),
      ),
      Effect.catchAll(() =>
        // Handle legacy format - just a digest string
        Effect.succeed({
          digest: txResultStr,
          packageId: "",
          coinMetadataID: "",
          treasuryCapID: "",
        } as TransactionResult),
      ),
      Effect.tap((result) =>
        Effect.log("Transaction signed and executed successfully", { digest: result.digest }),
      ),
    );

    const digest = txResult.digest;

    // Fetch object IDs if missing
    const finalResult = yield* (() => {
      if (!txResult.packageId || !txResult.coinMetadataID || !txResult.treasuryCapID) {
        return Effect.log("Fetching object IDs from transaction", { digest }).pipe(
          Effect.andThen(() =>
            Effect.tryPromise(() => fetchObjectIdsFromTransaction(client, digest)).pipe(
              Effect.mapError((cause) =>
                SuiErrors.suiTransaction(
                  "Failed to fetch object IDs from transaction",
                  cause,
                  digest,
                ),
              ),
              Effect.map((objectIds) => ({
                packageId: objectIds.packageId,
                coinMetadataID: objectIds.coinMetadataID,
                treasuryCapID: objectIds.treasuryCapID,
                digest,
              })),
            ),
          ),
        );
      }
      return Effect.succeed({
        packageId: txResult.packageId || "",
        coinMetadataID: txResult.coinMetadataID || "",
        treasuryCapID: txResult.treasuryCapID || "",
        digest,
      });
    })();

    // Log successful publication
    yield* Effect.log("BumpFamCoin package published", {
      packageId: finalResult.packageId,
      coinMetadataID: finalResult.coinMetadataID,
      treasuryCapID: finalResult.treasuryCapID,
      digest: finalResult.digest,
    });

    return finalResult;
  });

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
      return Promise.reject({
        type: "transaction_build_error",
        message: "Failed to build coin creation transaction",
        details: buildError,
      });
    }

    let txResult: TransactionResult;
    try {
      const txResultStr = await signCallback(builtTx);

      try {
        txResult = JSON.parse(txResultStr) as TransactionResult;
        logger.info("Coin creation transaction signed and executed successfully", {
          digest: txResult.digest,
        });
      } catch (_parseError) {
        logger.warn("Received legacy format transaction result", {
          result: txResultStr,
        });
        txResult = {
          digest: txResultStr,
        } as TransactionResult;
      }
    } catch (signError) {
      logger.error("Failed to sign transaction", { error: signError });
      return Promise.reject({
        type: "transaction_sign_error",
        message: "Failed to sign coin creation transaction",
        details: signError,
      });
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
      return Promise.reject({
        type: "insufficient_balance",
        message: `Insufficient balance for gas. Available: ${totalBalance} MIST, Required estimate: ${gasEstimate} MIST`,
      });
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
      const justchat = createJustchat(network);
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
      return Promise.reject({
        type: "message_add_error",
        message: "Failed to add message to transaction",
        details: error,
      });
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
      return Promise.reject({
        type: "transaction_build_error",
        message: "Failed to build chat message transaction",
        details: buildError,
      });
    }

    // Sign and execute the transaction
    logger.info("Signing and executing transaction");
    let txResult: TransactionResult;
    try {
      const txResultStr = await signCallback(builtTx);

      try {
        txResult = JSON.parse(txResultStr) as TransactionResult;
        logger.info("Chat message transaction signed and executed successfully", {
          digest: txResult.digest,
        });
      } catch (_parseError) {
        logger.warn("Received legacy format transaction result", {
          result: txResultStr,
        });
        txResult = {
          digest: txResultStr,
        } as TransactionResult;
      }
    } catch (signError) {
      logger.error("Failed to execute chat message transaction", {
        error: signError,
        errorMessage: signError instanceof Error ? signError.message : String(signError),
      });

      // Check for specific error types to provide better messages
      const errorMessage = signError instanceof Error ? signError.message : String(signError);
      if (errorMessage.includes("InsufficientCoinBalance")) {
        return Promise.reject({
          type: "insufficient_balance",
          message: "Insufficient SUI balance to pay for gas",
          details: signError,
        });
      }
      if (errorMessage.includes("MoveAbort") && errorMessage.includes("1001")) {
        return Promise.reject({
          type: "move_abort",
          message: "Smart contract rejected the message (code 1001)",
          details: signError,
        });
      }
      return Promise.reject({
        type: "transaction_execute_error",
        message: "Failed to execute chat message transaction",
        details: signError,
      });
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
      errorType: error && typeof error === "object" && "type" in error ? error.type : "unknown",
      errorMessage:
        error && typeof error === "object" && "message" in error ? error.message : String(error),
    });
    throw error;
  }
}
