import { z } from "@hono/zod-openapi";

export const getBankConnectionsSchema = z
  .object({ enabled: z.boolean().optional() })
  .optional();

export const createBankConnectionSchema = z.object({
  accessToken: z.string().nullable().optional(), // Teller
  enrollmentId: z.string().nullable().optional(), // Teller
  referenceId: z.string().nullable().optional(), // GoCardLess (removed)
  provider: z.enum(["teller", "plaid", "enablebanking"]),
  accounts: z.array(
    z.object({
      accountId: z.string(),
      institutionId: z.string(),
      logoUrl: z.string().nullable().optional(),
      name: z.string(),
      bankName: z.string(),
      currency: z.string(),
      enabled: z.boolean(),
      balance: z.number().optional(),
      type: z.enum([
        "credit",
        "depository",
        "other_asset",
        "loan",
        "other_liability",
      ]),
      accountReference: z.string().nullable().optional(), // EnableBanking & GoCardLess (removed)
      expiresAt: z.string().nullable().optional(), // EnableBanking & GoCardLess (removed)
    }),
  ),
});

export const deleteBankConnectionSchema = z.object({ id: z.string() });
