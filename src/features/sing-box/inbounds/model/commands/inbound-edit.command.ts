import { useCallback } from "react";

import {
  type InboundFormValues,
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { type DraftConfig, DraftConfigSchema } from "@/shared/api/contracts";

import { applyRealityPublicKey } from "../../lib/apply-reality-public-key.helper";
import { mapFormToInbound } from "../mappers/inbound.form-mapper";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useEditInbound() {
  const { data: rawDraftConfig } = useConfigQuery();
  const updateConfigMutation = useUpdateConfigMutation();

  const editInbound = useCallback(
    async (originalTag: string, updatedInbound: InboundFormValues) => {
      const parseResult = DraftConfigSchema.safeParse(rawDraftConfig);

      if (!parseResult.success) {
        throw new Error("Draft config is invalid");
      }

      const draftConfig: DraftConfig = parseResult.data;

      const parsedEditedInbound = mapFormToInbound(updatedInbound);

      const inbounds = draftConfig.inbounds ?? [];

      let nextDraftConfig: DraftConfig = {
        ...draftConfig,
        inbounds: inbounds.map((inbound) => {
          if (inbound.tag === originalTag) {
            return parsedEditedInbound;
          }

          return inbound;
        }),
      };

      if (updatedInbound.type === "vless") {
        nextDraftConfig = applyRealityPublicKey(
          nextDraftConfig,
          updatedInbound,
        );
      }

      const parsed = DraftConfigSchema.safeParse(nextDraftConfig);

      if (!parsed.success) {
        throw new Error(CONFIG_INVALID_AFTER_MAPPING);
      }

      return updateConfigMutation.mutateAsync(parsed.data);
    },
    [rawDraftConfig, updateConfigMutation],
  );

  return {
    editInbound,
    isPending: updateConfigMutation.isPending,
  };
}
