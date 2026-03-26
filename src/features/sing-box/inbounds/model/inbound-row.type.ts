import { type DraftInbound } from "@/shared/api/contracts";

export type InboundRow = {
  type: string | null;
  tag: string | null;
  listen_port: number | null;
  usersCount: number;
  inbound: DraftInbound;
};
