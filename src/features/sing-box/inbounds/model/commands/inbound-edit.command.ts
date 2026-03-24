import { useCallback } from "react";

import {
  type InboundFormValues,
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { ConfigSchema, type ConfigWithMetadata } from "@/shared/api/contracts";

import { applyRealityPublicKeyMetadata } from "../../lib/apply-reality-public-key-metadata.helper";
import { mapFormToInbound } from "../inbound.form-mapper";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useEditInbound() {
  const { data: configWithMetadata } = useConfigQuery();
  const singBoxConfig = configWithMetadata?.config;
  const updateConfigMutation = useUpdateConfigMutation();

  const editInbound = useCallback(
    (originalTag: string, updatedInbound: InboundFormValues) => {
      if (!singBoxConfig) {
        throw new Error("Config not loaded");
      }

      const parsedEditedInbound = mapFormToInbound(updatedInbound);

      const inbounds = singBoxConfig.inbounds ?? [];

      let nextconfigWithMetadata: ConfigWithMetadata = {
        metadata: configWithMetadata?.metadata,
        config: {
          ...singBoxConfig,
          inbounds: inbounds.map((inbound) => {
            if (inbound.tag === originalTag) {
              return parsedEditedInbound;
            }

            return inbound;
          }),
        },
      };

      if (updatedInbound.type === "vless") {
        nextconfigWithMetadata = applyRealityPublicKeyMetadata(
          nextconfigWithMetadata,
          updatedInbound,
        );
      }

      const parsed = ConfigSchema.safeParse(nextconfigWithMetadata.config);

      if (!parsed.success) {
        throw new Error(CONFIG_INVALID_AFTER_MAPPING);
      }

      return updateConfigMutation.mutateAsync(nextconfigWithMetadata);
    },
    [configWithMetadata?.metadata, singBoxConfig, updateConfigMutation],
  );

  return {
    editInbound,
    isPending: updateConfigMutation.isPending,
  };
}
