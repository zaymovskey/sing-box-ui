import { type SaveInboundInput } from "@/shared/api/contracts";

export const TCP_ONLY_PROTOCOLS: SaveInboundInput["type"][] = ["vless"];
export const UDP_ONLY_PROTOCOLS: SaveInboundInput["type"][] = ["hysteria2"];
export const TCP_UDP_PROTOCOLS: SaveInboundInput["type"][] = [];
