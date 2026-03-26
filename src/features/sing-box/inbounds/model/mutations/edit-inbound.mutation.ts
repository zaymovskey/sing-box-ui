import { useMutation, useQueryClient } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type DraftInbound, type OkResponse } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { editInbound } from "../../api/editInbound";

type EditInboundVariables = {
  originalTag: string;
  inbound: DraftInbound;
};

export function useEditInboundMutation() {
  const qc = useQueryClient();

  return useMutation<OkResponse, ApiError, EditInboundVariables>({
    mutationFn: ({ originalTag, inbound }) => editInbound(originalTag, inbound),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: singBoxQueryKeys.config() });
      await qc.invalidateQueries({ queryKey: singBoxQueryKeys.status() });
    },
  });
}
