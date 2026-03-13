import { type Inbound } from "@/features/sing-box/config-core";

export type InboundRow = {
  type: string | null;
  tag: string | null;
  listen_port: number | null;
  usersCount: number;
  inbound: Inbound;
};
