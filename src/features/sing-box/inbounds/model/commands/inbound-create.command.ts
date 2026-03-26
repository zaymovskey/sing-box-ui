import { useCallback } from "react";

import {
  type InboundFormValues,
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import {
  type DraftConfig,
  type DraftInbound,
  DraftInboundSchema,
} from "@/shared/api/contracts";

import { mapFormToInbound } from "../mappers/inbound.form-mapper";

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

export function useCreateInbound() {
  const { data: rawDraftConfig } = useConfigQuery();
  const updateConfigMutation = useUpdateConfigMutation();

  const createInbound = useCallback(
    async (newInbound: InboundFormValues) => {
      if (!isDraftConfigLike(rawDraftConfig)) {
        throw new Error("Draft config is invalid");
      }

      const parsedNewInbound = mapFormToInbound(newInbound);

      const inboundParseResult = DraftInboundSchema.safeParse(parsedNewInbound);

      if (!inboundParseResult.success) {
        throw new Error(CONFIG_INVALID_AFTER_MAPPING);
      }

      const inbounds = getRawInbounds(rawDraftConfig);

      const nextDraftConfig: DraftConfig = {
        ...rawDraftConfig,
        inbounds: [...inbounds, parsedNewInbound],
      };

      return updateConfigMutation.mutateAsync(nextDraftConfig);
    },
    [rawDraftConfig, updateConfigMutation],
  );

  return {
    createInbound,
    isPending: updateConfigMutation.isPending,
  };
}
