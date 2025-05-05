import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { BumpFamCoin } from '../../bumpwin-pilot/sdk/src/moveCall/bumpFamCoin';
import { logger } from "@workspace/logger";
import { isCoinMetadata, isTreasuryCap } from './utils';

// Define error types
type BlockchainError =
  | { type: "transaction_build_error"; message: string; details?: any }
  | { type: "transaction_sign_error"; message: string; details?: any }
  | { type: "transaction_execution_error"; message: string; details?: any }
  | { type: "unexpected_error"; message: string; details?: any };

/**
 * Helper function to sign and execute a transaction
 * @param transactionBlock Uint8Array containing the transaction block
 * @param signAndExecuteTransactionFn Function from dapp-kit to sign and execute
 * @returns Transaction digest
 */
export async function signTransactionAndExecute(
  transactionBlock: Uint8Array,
  signAndExecuteTransactionFn: (args: { transaction: string }, options: any) => void
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      logger.info("Signing transaction...");
      // Convert Uint8Array to Base64 string
      const base64Tx = Buffer.from(transactionBlock).toString('base64');
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
        }
      );
    } catch (error) {
      logger.error("Error in signAndExecuteTransaction:", error);
      reject(error);
    }
  });
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
  signCallback: (transactionBlock: Uint8Array) => Promise<string>
): Promise<{
  packageId: string;
  coinMetadataID: string;
  treasuryCapID: string;
  digest: string;
}> {
  try {
    const tx = new Transaction();
    tx.setSender(senderAddress);
    tx.setGasBudget(800_000_000);

    BumpFamCoin.publishBumpFamCoinPackage(tx, { sender: senderAddress });

    let builtTx;
    try {
      builtTx = await tx.build({ client });
      logger.info("Transaction built successfully", { sender: senderAddress });
    } catch (buildError) {
      logger.error("Failed to build transaction", { error: buildError });
      throw {
        type: "transaction_build_error",
        message: "Failed to build transaction",
        details: buildError
      };
    }

    let txResult;
    try {
      // signCallback内でsignAndExecuteTransactionを呼び出し、結果をJSON文字列として返す
      const txResultStr = await signCallback(builtTx);

      try {
        // JSON文字列をパース
        txResult = JSON.parse(txResultStr);
        logger.info("Transaction signed and executed successfully", {
          digest: txResult.digest,
          packageId: txResult.packageId,
          coinMetadataID: txResult.coinMetadataID,
          treasuryCapID: txResult.treasuryCapID
        });
      } catch (parseError) {
        // 古い形式（文字列のみ）の場合は、digestだけを抽出
        logger.warn("Received legacy format transaction result", { result: txResultStr });
        txResult = {
          digest: txResultStr,
          packageId: "",
          coinMetadataID: "",
          treasuryCapID: ""
        };
      }
    } catch (signError) {
      logger.error("Failed to sign and execute transaction", { error: signError });
      throw {
        type: "transaction_sign_error",
        message: "Failed to sign and execute transaction",
        details: signError
      };
    }

    // 結果を組み立てる
    const returnValue = {
      packageId: txResult.packageId || "",
      coinMetadataID: txResult.coinMetadataID || "",
      treasuryCapID: txResult.treasuryCapID || "",
      digest: txResult.digest
    };

    // パッケージ情報が取得できなかった場合でも、チェーン上のトランザクションを確認
    if (!returnValue.packageId || !returnValue.coinMetadataID || !returnValue.treasuryCapID) {
      logger.warn("Missing object information, attempting to fetch from blockchain", {
        packageId: returnValue.packageId,
        coinMetadataID: returnValue.coinMetadataID,
        treasuryCapID: returnValue.treasuryCapID
      });

      try {
        // 待機後に取得を試みる
        await new Promise(resolve => setTimeout(resolve, 3000));
        const txBlock = await client.getTransactionBlock({
          digest: txResult.digest,
          options: { showEffects: true, showObjectChanges: true }
        });

        // パッケージ情報の更新
        if (!returnValue.packageId) {
          returnValue.packageId = (txBlock.objectChanges?.find(
            (c) => c.type === 'published'
          ) as any)?.packageId || "";
        }

        if (!returnValue.coinMetadataID) {
          returnValue.coinMetadataID = (txBlock.objectChanges?.find(
            (c) => c.type === 'created' && isCoinMetadata(c.objectType)
          ) as any)?.objectId || "";
        }

        if (!returnValue.treasuryCapID) {
          returnValue.treasuryCapID = (txBlock.objectChanges?.find(
            (c) => c.type === 'created' && isTreasuryCap(c.objectType)
          ) as any)?.objectId || "";
        }

        logger.info("Updated package information from blockchain", {
          packageId: returnValue.packageId,
          coinMetadataID: returnValue.coinMetadataID,
          treasuryCapID: returnValue.treasuryCapID
        });
      } catch (fetchError) {
        logger.warn("Failed to fetch additional transaction details", { error: fetchError });
      }
    }

    // Log the return values
    logger.info("BumpFamCoin package published", {
      packageId: returnValue.packageId,
      coinMetadataID: returnValue.coinMetadataID,
      treasuryCapID: returnValue.treasuryCapID,
      digest: returnValue.digest
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
  signCallback: (transactionBlock: Uint8Array) => Promise<string>
) {
  try {
    // パラメータの検証
    if (!packageId || packageId === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      logger.error("Invalid packageId:", { packageId });
      throw new Error("Invalid package ID");
    }

    if (!params.treasuryCapID || params.treasuryCapID === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      logger.error("Invalid treasuryCapID:", { treasuryCapID: params.treasuryCapID });
      throw new Error("Invalid treasury cap ID");
    }

    if (!params.coinMetadataID || params.coinMetadataID === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      logger.error("Invalid coinMetadataID:", { coinMetadataID: params.coinMetadataID });
      throw new Error("Invalid coin metadata ID");
    }

    const tx = new Transaction();
    tx.setSender(senderAddress);
    tx.setGasBudget(900_000_000);

    BumpFamCoin.createCoin(
      tx,
      `${packageId}::bump_fam_coin::BUMP_FAM_COIN`,
      {
        treasuryCapID: params.treasuryCapID,
        coinMetadataID: params.coinMetadataID,
        name: params.name,
        symbol: params.symbol,
        description: params.description,
        iconUrl: params.iconUrl || null,
      }
    );

    logger.info("Creating BumpFamCoin with params", {
      packageId,
      treasuryCapID: params.treasuryCapID,
      coinMetadataID: params.coinMetadataID,
      name: params.name,
      symbol: params.symbol
    });

    let builtTx;
    try {
      builtTx = await tx.build({ client });
      logger.info("Transaction built successfully");
    } catch (buildError) {
      logger.error("Failed to build transaction", { error: buildError });
      throw {
        type: "transaction_build_error",
        message: "Failed to build coin creation transaction",
        details: buildError
      };
    }

    let txResult;
    try {
      // signCallback内でsignAndExecuteTransactionを呼び出し、結果をJSON文字列として返す
      const txResultStr = await signCallback(builtTx);

      try {
        // JSON文字列をパース
        txResult = JSON.parse(txResultStr);
        logger.info("Coin creation transaction signed and executed successfully", {
          digest: txResult.digest
        });
      } catch (parseError) {
        // 古い形式（文字列のみ）の場合は、digestだけを抽出
        logger.warn("Received legacy format transaction result", { result: txResultStr });
        txResult = {
          digest: txResultStr
        };
      }
    } catch (signError) {
      logger.error("Failed to sign transaction", { error: signError });
      throw {
        type: "transaction_sign_error",
        message: "Failed to sign coin creation transaction",
        details: signError
      };
    }

    // 結果を組み立てる
    const returnValue = {
      digest: txResult.digest,
      result: txResult
    };

    // Log the coin creation result
    logger.info("BumpFamCoin created", {
      name: params.name,
      symbol: params.symbol,
      digest: returnValue.digest,
      packageId: packageId
    });

    return returnValue;
  } catch (error) {
    logger.error("Unexpected error during coin creation", {
      error,
      params: {
        packageId,
        name: params.name,
        symbol: params.symbol
      }
    });
    throw error;
  }
}
