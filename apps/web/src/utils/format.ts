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

// Format timestamp for display in UTC
export function formatTime(date: Date): string {
  const timeString = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() > today.getTime()) {
    return timeString;
  }

  if (date.getTime() > yesterday.getTime()) {
    return `Yesterday ${timeString}`;
  }

  const dateString = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return `${dateString} ${timeString}`;
}
