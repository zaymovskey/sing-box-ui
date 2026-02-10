import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateConfigJson } from "../api/config-core.api";
import { singBoxQueryKeys } from "../lib/config-core.query-keys";
import { type Config } from "./config-core.schema";

export function useUpdateConfigMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (config: Config) => updateConfigJson(config),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: singBoxQueryKeys.config() });
    },
  });
}
