/**
 * SUI token constants
 */
export const SUI_DECIMALS = 9;
export const SUI_SYMBOL = "SUI";
export const SUI_TYPE = "0x2::sui::SUI";

/**
 * Convert base units to decimal units
 * @example
 * 1 SUI = 10^9 base units
 */
export const SUI_BASE_UNIT = 10 ** SUI_DECIMALS;

/**
 * OozeFam package constants (devnet)
 */
export const OOZE_FAM_PACKAGE_ID =
	"0x8010cf880738068037c1619e652d4e79188252e4dab6b1c627e812a723e511cb";
export const OOZE_FAM_COIN_METADATA_ID =
	"0x5b1da15b68d6e0ebba8b5bd78692cf2a9aaff4e55245e2d8b4a37c11226263b5";
export const OOZE_FAM_TREASURY_CAP_ID =
	"0x5a439c53472c0d16382ebeb2cbe1a9d51cf8ee8dde4e993b7250776b33548b21";
export const OOZE_FAM_COIN_TYPE = `${OOZE_FAM_PACKAGE_ID}::ooze_fam_coin::OOZE_FAM_COIN`;
