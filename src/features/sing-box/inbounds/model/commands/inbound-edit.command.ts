import { useCallback } from "react";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { SaveInboundInputSchema } from "@/shared/api/contracts";

import { mapFormToInbound } from "../mappers/inbound.form-mapper";
import { useEditInboundMutation } from "../mutations/edit-inbound.mutation";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useEditInbound() {
  const editInboundMutation = useEditInboundMutation();

  const editInbound = useCallback(
    async (internalTag: string, updatedInbound: InboundFormValues) => {
      const parsedEditedInbound = mapFormToInbound(updatedInbound);

      const inboundParseResult =
        SaveInboundInputSchema.safeParse(parsedEditedInbound);

      if (!inboundParseResult.success) {
        throw new Error(CONFIG_INVALID_AFTER_MAPPING);
      }

      return editInboundMutation.mutateAsync({
        originalInternalTag: internalTag,
        inbound: inboundParseResult.data,
      });
    },
    [editInboundMutation],
  );

  return {
    editInbound,
    isPending: editInboundMutation.isPending,
  };
}
