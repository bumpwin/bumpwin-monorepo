// Re-export from @workspace/utils to maintain consistency
export type { ApiError } from "@workspace/utils";
export { ApiErrors } from "@workspace/utils";

/**
 * Maps error types to HTTP status codes
 */
export const getErrorStatusCode = (error: import("@workspace/utils").ApiError): number => {
  switch (error._tag) {
    case "NotFoundError":
      return 404;
    case "ValidationError":
      return 422;
    case "AuthError":
      return 401;
    case "DatabaseError":
    case "NetworkError":
    case "ConfigError":
      return 500;
    default:
      return 500;
  }
};
