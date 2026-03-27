import { type DraftInbound } from "@/shared/api/contracts";

import { type InboundRow } from "../model/inbound-row.type";

export function mapInboundsListToRows(inbounds: DraftInbound[]): InboundRow[] {
  return inbounds.map((inbound) => ({
    tag: inbound.tag ?? null,
    type: inbound.type,
    listen_port: inbound.listen_port ?? null,
    usersCount: inbound.users?.length ?? 0,
    inbound,
  }));
}
