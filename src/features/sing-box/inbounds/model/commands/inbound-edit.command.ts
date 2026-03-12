import { useCallback } from "react";

import { type Config, ConfigSchema } from "@/shared/api/contracts";

import { type InboundFormValues } from "../../../config-core/model/config-core.inbounds-schema";
import { useUpdateConfigMutation } from "../../../config-core/model/config-core.mutation";
import { useConfigQuery } from "../../../config-core/model/config-core.query";
import { mapFormToInbound } from "../inbound.form-mapper";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useEditInbound() {
  const { data: singBoxConfig } = useConfigQuery();
  const updateConfigMutation = useUpdateConfigMutation();

  const editInbound = useCallback(
    async (updatedInbound: InboundFormValues) => {
      if (!singBoxConfig) {
        throw new Error("Config not loaded");
      }

      const parsedEditedInbound = mapFormToInbound(updatedInbound);

      const inbounds = singBoxConfig.inbounds ?? [];
      const nextConfig: Config = {
        ...singBoxConfig,
        inbounds: [
          ...inbounds.map((inbound) => {
            if (inbound.tag === updatedInbound.tag) {
              return parsedEditedInbound;
            }
            return inbound;
          }),
        ],
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
    editInbound,
    isPending: updateConfigMutation.isPending,
  };
}
