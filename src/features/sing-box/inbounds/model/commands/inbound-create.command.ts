import { useCallback } from "react";

import { type InboundFormValues } from "@/features/sing-box/config-core";
import { SaveInboundInputSchema } from "@/shared/api/contracts";

import { mapFormToInbound } from "../mappers/inbound.form-mapper";
import { useCreateInboundMutation } from "../mutations/create-inbound.mutation";

export const CONFIG_INVALID_AFTER_MAPPING = "CONFIG_INVALID_AFTER_MAPPING";

export function useCreateInbound() {
  const createInboundMutation = useCreateInboundMutation();

  const createInbound = useCallback(
    async (newInbound: InboundFormValues) => {
      const parsedNewInbound = mapFormToInbound(newInbound);
      const inboundParseResult =
        SaveInboundInputSchema.safeParse(parsedNewInbound);

      if (!inboundParseResult.success) {
        throw new Error(CONFIG_INVALID_AFTER_MAPPING);
      }

      return createInboundMutation.mutateAsync(inboundParseResult.data);
    },
    [createInboundMutation],
  );

  return {
    createInbound,
    isPending: createInboundMutation.isPending,
  };
}
