import { useCallback } from "react";

import {
  type InboundFormValues,
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { type Config, ConfigSchema } from "@/shared/api/contracts";

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

function applyRealityPublicKeyMetadata(
  config: Config,
  values: Extract<InboundFormValues, { type: "vless" }>,
): Config {
  if (!values.reality_enabled) {
    return config;
  }

  if (!values.reality_private_key || !values._reality_public_key) {
    return config;
  }

  return {
    ...config,
    _panel: {
      ...config._panel,
      realityPublicKeys: {
        ...config._panel?.realityPublicKeys,
        [values.reality_private_key]: values._reality_public_key,
      },
    },
  };
}
