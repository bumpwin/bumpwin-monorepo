export * from "./console";
export * from "./types";

import { createConsoleLogger } from "./console";
export const logger = createConsoleLogger();
