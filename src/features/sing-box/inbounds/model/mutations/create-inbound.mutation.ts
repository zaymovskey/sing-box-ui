import { useMutation, useQueryClient } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type OkResponse, type StoredInbound } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { createInbound } from "../../api/create-inbound.api";

export function useCreateInboundMutation() {
  const qc = useQueryClient();

  return useMutation<OkResponse, ApiError, StoredInbound>({
    mutationFn: (config) => createInbound(config),
    onSuccess: async () => {
      void qc.invalidateQueries({ queryKey: singBoxQueryKeys.inbounds() });
      void qc.invalidateQueries({ queryKey: singBoxQueryKeys.config() });
      void qc.invalidateQueries({ queryKey: singBoxQueryKeys.status() });
    },
  });
}
