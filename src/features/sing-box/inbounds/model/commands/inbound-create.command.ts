import { useCallback } from "react";

import {
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { type InboundFormValues } from "@/features/sing-box/config-core";
import { ConfigSchema, type ConfigWithMetadata } from "@/shared/api/contracts";

import { applyRealityPublicKeyMetadata } from "../../lib/apply-reality-public-key-metadata.helper";
import { mapFormToInbound } from "../inbound.form-mapper";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useCreateInbound() {
  const { data: configWithMetadata } = useConfigQuery();
  const singBoxConfig = configWithMetadata?.config;
  const updateConfigMutation = useUpdateConfigMutation();

  const createInbound = useCallback(
    (newInbound: InboundFormValues) => {
      if (!singBoxConfig) {
        throw new Error("Config not loaded");
      }

      const parsedNewInbound = mapFormToInbound(newInbound);

      const inbounds = singBoxConfig.inbounds ?? [];
      let nextConfigWithMetadata: ConfigWithMetadata = {
        metadata: configWithMetadata?.metadata,
        config: {
          ...singBoxConfig,
          inbounds: [...inbounds, parsedNewInbound],
        },
      };

      if (newInbound.type === "vless") {
        nextConfigWithMetadata = applyRealityPublicKeyMetadata(
          nextConfigWithMetadata,
          newInbound,
        );
      }

      const configParsedRes = ConfigSchema.safeParse(
        nextConfigWithMetadata.config,
      );
      if (!configParsedRes.success) {
        throw new Error(CONFIG_INVALID_AFTER_MAPPING);
      }

      return updateConfigMutation.mutateAsync(nextConfigWithMetadata);
    },
    [configWithMetadata?.metadata, singBoxConfig, updateConfigMutation],
  );

  return {
    createInbound,
    isPending: updateConfigMutation.isPending,
  };
}
