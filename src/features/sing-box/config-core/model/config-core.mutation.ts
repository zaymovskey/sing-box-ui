import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type ConfigWithMetadata } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { updateConfigJson } from "../api/config-core.api";
import { singBoxQueryKeys } from "../lib/config-core.query-keys";

export function useUpdateConfigMutation() {
  const qc = useQueryClient();

  return useMutation<void, ApiError, ConfigWithMetadata>({
    mutationFn: (config) => updateConfigJson(config),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: singBoxQueryKeys.config() });
    },
  });
}
