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
    (tag: string) => {
      if (!singBoxConfig) {
        throw new Error("Config not loaded");
      }

      const deletingInbound = singBoxConfig.inbounds?.find(
        (inb) => inb.tag === tag,
      );
      if (!deletingInbound) {
        throw new Error("Inbound with the specified tag not found");
      }

      if (deletingInbound.type === "vless" && deletingInbound.tls?.reality) {
        const realityPrivateKey = deletingInbound.tls.reality.private_key;
        if (realityPrivateKey) {
          delete singBoxConfig._panel?.realityPublicKeys[realityPrivateKey];
        }
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
