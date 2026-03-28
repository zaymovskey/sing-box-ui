import {
  type DraftInbound,
  type Hysteria2User,
  type VlessUser,
} from "@/shared/api/contracts";

export function getInboundUserName(
  inboundType: DraftInbound["type"],
  user: unknown,
) {
  if (!user || typeof user !== "object") {
    return "Без имени";
  }

  if (inboundType === "vless") {
    const vlessUser = user as VlessUser;
    return vlessUser.name ?? vlessUser.uuid;
  }

  if (inboundType === "hysteria2") {
    const hysteria2User = user as Hysteria2User;
    return hysteria2User.name ?? "Без имени";
  }

  return "Без имени";
}
