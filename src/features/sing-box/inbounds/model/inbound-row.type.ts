import { type StoredInbound } from "@/shared/api/contracts";

export type InboundRow = {
  type: string | null;
  tag: string | null;
  listen_port: number | null;
  usersCount: number;
  inbound: StoredInbound;
};
