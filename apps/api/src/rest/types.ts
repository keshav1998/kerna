import type { Session } from "@api/utils/auth";
import type { Database } from "@kerna/db/client";

export type Context = {
  Variables: {
    db: Database;
    session: Session;
    teamId: string;
    userId?: string;
    clientIp?: string;
  };
};
