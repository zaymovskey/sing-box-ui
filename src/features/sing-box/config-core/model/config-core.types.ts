import { type Config } from "@/shared/api/contracts";

export type ConfigInbound = NonNullable<Config["inbounds"]>[number];
export type InboundUser = Extract<
  ConfigInbound,
  { users: unknown[] }
>["users"][number];
export type InboundWithUsers = Extract<ConfigInbound, { users: unknown[] }>;
