"use server";

import { authActionClient } from "@/actions/safe-action";
import { LogEvents } from "@kerna/events/events";
import type { SyncConnectionPayload } from "@kerna/jobs/schema";
import { tasks } from "@trigger.dev/sdk";
import { z } from "zod";

export const manualSyncTransactionsAction = authActionClient
  .schema(
    z.object({
      connectionId: z.string(),
    }),
  )
  .metadata({
    name: "manual-sync-transactions",
    track: {
      event: LogEvents.TransactionsManualSync.name,
      channel: LogEvents.TransactionsManualSync.channel,
    },
  })
  .action(async ({ parsedInput: { connectionId } }) => {
    const event = await tasks.trigger("sync-connection", {
      connectionId,
      manualSync: true,
    } satisfies SyncConnectionPayload);

    return event;
  });
