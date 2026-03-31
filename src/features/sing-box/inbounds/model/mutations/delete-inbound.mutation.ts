import { useMutation, useQueryClient } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type OkResponse } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { deleteInbound } from "../../api/delete-inbound.api";

export function useDeleteInboundMutation() {
  const qc = useQueryClient();

  return useMutation<OkResponse, ApiError, string>({
    mutationFn: (tag) => deleteInbound(tag),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: singBoxQueryKeys.inbounds() }),
        qc.invalidateQueries({ queryKey: singBoxQueryKeys.config() }),
        qc.invalidateQueries({ queryKey: singBoxQueryKeys.status() }),
      ]);
    },
  });
}
