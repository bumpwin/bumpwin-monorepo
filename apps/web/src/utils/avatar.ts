// Helper function to generate avatar emoji based on address
export function generateAvatar(address: string | undefined | null): string {
  if (!address || address.length === 0) return "🌟"; // Default emoji

  // Using a default index (0) if we can't get a valid character code
  const lastChar = address.slice(-1).charCodeAt(0) || 0;
  const index = Math.abs(lastChar % 10);
  const emojis = ["🎁", "🔴", "🎭", "💎", "🏍️", "🔵", "🌟", "🚀", "🎮", "🎯"];
  return emojis[index] || "🌟"; // Fallback emoji if index is somehow invalid
}
