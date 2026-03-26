import { useCallback } from "react";

import {
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { type DraftConfig, type DraftInbound } from "@/shared/api/contracts";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

function isDraftConfigLike(value: unknown): value is DraftConfig {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getRawInbounds(rawDraftConfig: unknown): DraftInbound[] {
  if (!isDraftConfigLike(rawDraftConfig)) {
    return [];
  }

  return Array.isArray(rawDraftConfig.inbounds)
    ? (rawDraftConfig.inbounds as DraftInbound[])
    : [];
}

export function useDeleteInbound() {
  const { data: rawDraftConfig } = useConfigQuery();
  const updateConfigMutation = useUpdateConfigMutation();

  const deleteInbound = useCallback(
    async (tag: string) => {
      if (!isDraftConfigLike(rawDraftConfig)) {
        throw new Error("Draft config is invalid");
      }

      const inbounds = getRawInbounds(rawDraftConfig);

      const deletingInbound = inbounds.find((inb) => inb.tag === tag);

      if (!deletingInbound) {
        throw new Error("Inbound with the specified tag not found");
      }

      const nextDraftConfig: DraftConfig = {
        ...rawDraftConfig,
        inbounds: inbounds.filter((inb) => inb.tag !== tag),
      };

      return updateConfigMutation.mutateAsync(nextDraftConfig);
    },
    [rawDraftConfig, updateConfigMutation],
  );

  return {
    deleteInbound,
    isPending: updateConfigMutation.isPending,
  };
}
