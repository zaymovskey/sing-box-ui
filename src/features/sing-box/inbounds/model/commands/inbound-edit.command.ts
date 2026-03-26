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

export function useEditInbound() {
  const { data: rawDraftConfig } = useConfigQuery();
  const updateConfigMutation = useUpdateConfigMutation();

  const editInbound = useCallback(
    async (originalTag: string, updatedInbound: InboundFormValues) => {
      if (!isDraftConfigLike(rawDraftConfig)) {
        throw new Error("Draft config is invalid");
      }

      const parsedEditedInbound = mapFormToInbound(updatedInbound);

      const inboundParseResult =
        DraftInboundSchema.safeParse(parsedEditedInbound);

      if (!inboundParseResult.success) {
        throw new Error(CONFIG_INVALID_AFTER_MAPPING);
      }

      const inbounds = getRawInbounds(rawDraftConfig);

      const hasInboundToEdit = inbounds.some(
        (inbound) => inbound.tag === originalTag,
      );

      if (!hasInboundToEdit) {
        throw new Error("Inbound with the specified tag not found");
      }

      const nextDraftConfig: DraftConfig = {
        ...rawDraftConfig,
        inbounds: inbounds.map((inbound) => {
          if (inbound.tag === originalTag) {
            return parsedEditedInbound;
          }

          return inbound;
        }),
      };

      return updateConfigMutation.mutateAsync(nextDraftConfig);
    },
    [rawDraftConfig, updateConfigMutation],
  );

  return {
    editInbound,
    isPending: updateConfigMutation.isPending,
  };
}
