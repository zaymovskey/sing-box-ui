import { useCallback } from "react";

import {
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { type Config, ConfigSchema } from "@/shared/api/contracts";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useDeleteInbound() {
  const { data: singBoxConfig } = useConfigQuery();
  const updateConfigMutation = useUpdateConfigMutation();

  const deleteInbound = useCallback(
    async (tag: string) => {
      if (!singBoxConfig) {
        throw new Error("Config not loaded");
      }

      const inbounds = singBoxConfig.inbounds?.filter((inb) => inb.tag !== tag);
      const nextConfig: Config = {
        ...singBoxConfig,
        inbounds,
      };

      const parsed = ConfigSchema.safeParse(nextConfig);
      if (!parsed.success) {
        throw new Error(CONFIG_INVALID_AFTER_MAPPING);
      }

      return updateConfigMutation.mutateAsync(parsed.data);
    },
    [singBoxConfig, updateConfigMutation],
  );

  return {
    deleteInbound,
    isPending: updateConfigMutation.isPending,
  };
}
