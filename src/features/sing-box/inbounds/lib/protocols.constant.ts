import { type SaveInboundInput } from "@/shared/api/contracts";

export const TCP_ONLY_PROTOCOLS: SaveInboundInput["type"][] = ["vless"];
export const UDP_ONLY_PROTOCOLS: SaveInboundInput["type"][] = ["hysteria2"];
export const TCP_UDP_PROTOCOLS: SaveInboundInput["type"][] = [];

export const getNetworkProtocol = (
  protocol: SaveInboundInput["type"],
): "tcp" | "udp" | "tcp-udp" => {
  if (TCP_ONLY_PROTOCOLS.includes(protocol)) {
    return "tcp";
  }
  if (UDP_ONLY_PROTOCOLS.includes(protocol)) {
    return "udp";
  }
  return "tcp-udp";
};
