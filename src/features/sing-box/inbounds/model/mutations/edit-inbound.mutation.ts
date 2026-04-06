import { useMutation, useQueryClient } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type OkResponse, type SaveInboundInput } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { editInbound } from "../../api/edit-inbound.api";

type EditInboundVariables = {
  originalTag: string;
  inbound: SaveInboundInput;
};

export function useEditInboundMutation() {
  const qc = useQueryClient();

  return useMutation<OkResponse, ApiError, EditInboundVariables>({
    mutationFn: ({ originalTag, inbound }) => editInbound(originalTag, inbound),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: singBoxQueryKeys.inbounds() }),
        qc.invalidateQueries({ queryKey: singBoxQueryKeys.config() }),
        qc.invalidateQueries({ queryKey: singBoxQueryKeys.status() }),
      ]);
    },
  });
}
