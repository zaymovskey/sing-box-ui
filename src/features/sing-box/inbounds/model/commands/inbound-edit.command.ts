import { useCallback } from "react";

import {
  type InboundFormValues,
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { type Config, ConfigSchema } from "@/shared/api/contracts";

import { applyRealityPublicKeyMetadata } from "../../lib/apply-reality-public-key-metadata.helper";
import { mapFormToInbound } from "../inbound.form-mapper";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useEditInbound() {
  const { data: singBoxConfig } = useConfigQuery();
  const updateConfigMutation = useUpdateConfigMutation();

  const editInbound = useCallback(
    (updatedInbound: InboundFormValues) => {
      if (!singBoxConfig) {
        throw new Error("Config not loaded");
      }

      const parsedEditedInbound = mapFormToInbound(updatedInbound);

      const inbounds = singBoxConfig.inbounds ?? [];
      let nextConfig: Config = {
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

      if (updatedInbound.type === "vless") {
        nextConfig = applyRealityPublicKeyMetadata(nextConfig, updatedInbound);
      }

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
