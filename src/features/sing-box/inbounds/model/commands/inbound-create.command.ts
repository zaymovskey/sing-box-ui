import { useCallback } from "react";

import {
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type Config, ConfigSchema } from "@/shared/api/contracts";

import { mapFormToInbound } from "../inbound.form-mapper";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useCreateInbound() {
  const { data: singBoxConfig } = useConfigQuery();
  const updateConfigMutation = useUpdateConfigMutation();

  const createInbound = useCallback(
    (newInbound: InboundFormValues) => {
      if (!singBoxConfig) {
        throw new Error("Config not loaded");
      }

      const parsedNewInbound = mapFormToInbound(newInbound);

      const inbounds = singBoxConfig.inbounds ?? [];
      const nextConfig: Config = {
        ...singBoxConfig,
        inbounds: [...inbounds, parsedNewInbound],
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
    createInbound,
    isPending: updateConfigMutation.isPending,
  };
}
