import { zValidator } from "@hono/zod-validator";
import { generateMockPriceData } from "@workspace/utils";
import { Hono } from "hono";
import { z } from "zod";

const querySchema = z.object({
  seed: z.string().default("0"),
  freq: z.enum(["day", "min"]).default("day"),
  count: z
    .string()
    .transform(Number)
    .refine((val) => !Number.isNaN(val) && val > 0 && val <= 1000, {
      message: "count must be a number between 1 and 1000",
    })
    .default("30"),
});

export const mockpriceRoute = new Hono().get(
  "/",
  zValidator("query", querySchema),
  (c) => {
    const { seed, freq, count } = c.req.valid("query");
    const data = generateMockPriceData(seed, freq, count);
    return c.json({ data });
  },
);
