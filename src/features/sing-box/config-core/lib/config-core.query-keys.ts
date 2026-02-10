export const singBoxQueryKeys = {
  all: ["sing-box"] as const,

  config: () => [...singBoxQueryKeys.all, "config"] as const,
};
