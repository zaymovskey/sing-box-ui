export const singBoxQueryKeys = {
  all: ["sing-box"] as const,

  config: () => [...singBoxQueryKeys.all, "config"] as const,
  status: () => [...singBoxQueryKeys.all, "status"] as const,
  inbounds: () => [...singBoxQueryKeys.all, "inbounds"] as const,
  inbound: (internalTag: string) =>
    [...singBoxQueryKeys.inbounds(), "detail", internalTag] as const,
  securityAssets: (type?: "tls" | "reality") =>
    [...singBoxQueryKeys.all, "security-assets", type] as const,
  inboundsStats: () => [...singBoxQueryKeys.all, "inbounds", "stats"] as const,
};
