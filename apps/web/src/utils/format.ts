/**
 * Format a number as a currency string with K (thousands) or M (millions)
 * @param value - Number to format
 * @returns Formatted string (e.g. $49.75K)
 */
export function formatCurrency(value: number): string {
	if (value >= 1000000) {
		return `$${(value / 1000000).toFixed(2)}M`;
	}
	if (value >= 1000) {
		return `$${(value / 1000).toFixed(2)}K`;
	}
	return `$${value.toFixed(2)}`;
}
