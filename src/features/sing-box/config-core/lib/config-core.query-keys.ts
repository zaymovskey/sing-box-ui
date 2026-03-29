export const singBoxQueryKeys = {
  all: ["sing-box"] as const,

  config: () => [...singBoxQueryKeys.all, "config"] as const,
  status: () => [...singBoxQueryKeys.all, "status"] as const,
  inbounds: () => [...singBoxQueryKeys.all, "inbounds"] as const,
  securityAssets: () => [...singBoxQueryKeys.all, "security-assets"] as const,
};
