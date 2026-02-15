import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type Config } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { updateConfigJson } from "../api/config-core.api";
import { singBoxQueryKeys } from "../lib/config-core.query-keys";

export function useUpdateConfigMutation() {
  const qc = useQueryClient();

  return useMutation<void, ApiError, Config>({
    mutationFn: (config) => updateConfigJson(config),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: singBoxQueryKeys.config() });
    },
  });
}
