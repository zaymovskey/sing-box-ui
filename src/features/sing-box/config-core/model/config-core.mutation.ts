import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type DraftConfig } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { updateConfigJson } from "../api/config-core.api";
import { singBoxQueryKeys } from "../lib/config-core.query-keys";

export function useUpdateConfigMutation() {
  const qc = useQueryClient();

  return useMutation<void, ApiError, DraftConfig>({
    mutationFn: (config) => updateConfigJson(config),
    onSuccess: async () => {
      void qc.invalidateQueries({ queryKey: singBoxQueryKeys.inbounds() });
      void qc.invalidateQueries({ queryKey: singBoxQueryKeys.config() });
      void qc.invalidateQueries({ queryKey: singBoxQueryKeys.status() });
    },
  });
}
