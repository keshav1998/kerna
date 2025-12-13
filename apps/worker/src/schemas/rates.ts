import { z } from "zod";

/**
 * Rates job schemas (independent from @kerna/jobs)
 */

export const ratesSchedulerSchema = z.object({
  // Empty payload - scheduler runs globally
});

export type RatesSchedulerPayload = z.infer<typeof ratesSchedulerSchema>;
