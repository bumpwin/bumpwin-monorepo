import { logger } from "@workspace/logger";

export const mockUploadImageToWalrus = async (file: File): Promise<string> => {
  try {
    // Mock implementation - simulate uploading by logging file info
    logger.info("Mocking image upload to Walrus:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return a placeholder URL
    return "https://example.com/placeholder.png";
  } catch (error) {
    logger.error("Failed to upload image to Walrus:", error);
    throw new Error("Failed to upload image");
  }
};
