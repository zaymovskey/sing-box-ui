import type { Config } from "../../config-core/model/config-core.schema";
import { type InboundRow } from "./inbound-row.type";

function getUsersCount(
  inb: { type: string } & Record<string, unknown>,
): number {
  const maybeUsers = (inb as { users?: unknown }).users;
  return Array.isArray(maybeUsers) ? maybeUsers.length : 0;
}

export function mapInboundsToRows(config: Config): InboundRow[] {
  const inbounds = config.inbounds ?? [];

  return inbounds.map((inb) => {
    const tag = inb.tag ?? null;
    const type = inb.type ?? null;
    const listen_port = inb.listen_port ?? null;
    const usersCount = getUsersCount(inb);

    return {
      tag,
      type,
      listen_port,
      usersCount,
    };
  });
}
