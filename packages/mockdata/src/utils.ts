import type { MEME_ID } from "@workspace/types";

/**
 * Generate a mock MEME_ID from a symbol
 * In production, this would be the actual coinMetadataID from Sui blockchain
 */
export const generateMemeId = (symbol: string): MEME_ID => {
  // Create a deterministic hash-like string from the symbol
  const hash = symbol.split("").reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);

  // Convert to hex and pad to 64 characters
  const hexHash = Math.abs(hash).toString(16).padEnd(16, "0");
  const paddedHex = hexHash.repeat(4).substring(0, 64);

  return `0x${paddedHex}` as MEME_ID;
};
