import { useCallback } from "react";

import { type CreateInboundFormValues } from "../../config-core/model/config-core.inbounds-schema";
import { useUpdateConfigMutation } from "../../config-core/model/config-core.mutation";
import { useConfigQuery } from "../../config-core/model/config-core.query";
import {
  type Config,
  ConfigSchema,
} from "../../config-core/model/config-core.schema";
import { mapFormToInbound } from "./inbound-create.mapper";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useCreateInbound() {
  const { data: singBoxConfig } = useConfigQuery();
  const updateConfigMutation = useUpdateConfigMutation();

  const createInbound = useCallback(
    async (newInbound: CreateInboundFormValues) => {
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
