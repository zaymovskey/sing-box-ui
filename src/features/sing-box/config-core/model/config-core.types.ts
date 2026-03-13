import { type Config } from "@/shared/api/contracts";

export type Inbound = NonNullable<Config["inbounds"]>[number];
export type InboundUser = Extract<
  Inbound,
  { users: unknown[] }
>["users"][number];
export type InboundWithUsers = Extract<Inbound, { users: unknown[] }>;
