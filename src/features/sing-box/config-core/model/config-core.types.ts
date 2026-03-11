import { type Config } from "@/shared/api/contracts";

export type Inbound = NonNullable<Config["inbounds"]>[number];
