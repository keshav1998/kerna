import { client } from "@kerna/engine-client";
import { deleteConnectionSchema } from "@kerna/jobs/schema";
import { schemaTask } from "@trigger.dev/sdk";

export const deleteConnection = schemaTask({
  id: "delete-connection",
  schema: deleteConnectionSchema,
  maxDuration: 60,
  queue: {
    concurrencyLimit: 5,
  },
  run: async (payload) => {
    const { referenceId, provider, accessToken } = payload;

    await client.connections.delete.$delete({
      json: {
        id: referenceId!,
        provider,
        accessToken: accessToken ?? undefined,
      },
    });
  },
});
