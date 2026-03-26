import { useCallback } from "react";

import {
  useConfigQuery,
  useUpdateConfigMutation,
} from "@/features/sing-box/config-core";
import { type DraftConfig, DraftConfigSchema } from "@/shared/api/contracts";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useDeleteInbound() {
  const { data: rawDraftConfig } = useConfigQuery();
  const updateConfigMutation = useUpdateConfigMutation();

  const deleteInbound = useCallback(
    async (tag: string) => {
      const parseResult = DraftConfigSchema.safeParse(rawDraftConfig);

      if (!parseResult.success) {
        throw new Error("Draft config is invalid");
      }

      const draftConfig: DraftConfig = parseResult.data;

      const deletingInbound = draftConfig.inbounds?.find(
        (inb) => inb.tag === tag,
      );

      if (!deletingInbound) {
        throw new Error("Inbound with the specified tag not found");
      }

      const inbounds = draftConfig.inbounds?.filter((inb) => inb.tag !== tag);

      const nextDraftConfig: DraftConfig = {
        ...draftConfig,
        inbounds,
      };

      const parsed = DraftConfigSchema.safeParse(nextDraftConfig);

      if (!parsed.success) {
        throw new Error(CONFIG_INVALID_AFTER_MAPPING);
      }

      return updateConfigMutation.mutateAsync(parsed.data);
    },
    [rawDraftConfig, updateConfigMutation],
  );

  return {
    deleteInbound,
    isPending: updateConfigMutation.isPending,
  };
}
