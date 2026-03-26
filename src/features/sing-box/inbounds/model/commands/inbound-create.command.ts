import { useCallback } from "react";

import {
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { type InboundFormValues } from "@/features/sing-box/config-core";
import { type DraftConfig, DraftConfigSchema } from "@/shared/api/contracts";

import { mapFormToInbound } from "../mappers/inbound.form-mapper";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useCreateInbound() {
  const { data: rawDraftConfig } = useConfigQuery();
  const updateConfigMutation = useUpdateConfigMutation();

  const createInbound = useCallback(
    async (newInbound: InboundFormValues) => {
      const parseResult = DraftConfigSchema.safeParse(rawDraftConfig);

      if (!parseResult.success) {
        throw new Error("Draft config is invalid");
      }

      const draftConfig = parseResult.data;

      const parsedNewInbound = mapFormToInbound(newInbound);

      const inbounds = draftConfig.inbounds ?? [];

      const nextDraftConfig: DraftConfig = {
        ...draftConfig,
        inbounds: [...inbounds, parsedNewInbound],
      };

      const draftParsedRes = DraftConfigSchema.safeParse(nextDraftConfig);

      if (!draftParsedRes.success) {
        throw new Error(CONFIG_INVALID_AFTER_MAPPING);
      }

      return updateConfigMutation.mutateAsync(draftParsedRes.data);
    },
    [rawDraftConfig, updateConfigMutation],
  );

  return {
    createInbound,
    isPending: updateConfigMutation.isPending,
  };
}
