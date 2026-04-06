import { getDb } from "@/server/db/client";
import {
  type InboundUserRow,
  InboundUserRowSchema,
} from "@/shared/api/contracts";

const sql = String.raw;

export function getInboundUserByInternalName(
  internalName: string,
): InboundUserRow | null {
  const db = getDb();

  const user = db
    .prepare(sql`SELECT * FROM inbound_users WHERE internal_name = ?`)
    .get(internalName);

  if (!user) {
    return null;
  }

  console.log("raw user from db:", user);

  const parsedRowUser = InboundUserRowSchema.parse(user);

  return parsedRowUser;
}
