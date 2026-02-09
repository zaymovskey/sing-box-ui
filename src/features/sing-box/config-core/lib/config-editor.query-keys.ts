export const singBoxQueryKeys = {
  all: ["sing-box"] as const,

  configEditor: () => [...singBoxQueryKeys.all, "config-editor"] as const,
};
