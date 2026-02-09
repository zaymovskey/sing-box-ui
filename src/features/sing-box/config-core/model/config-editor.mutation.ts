import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateConfigJson } from "../api/config-editor.api";
import { singBoxQueryKeys } from "../lib/config-editor.query-keys";
import { type Config } from "./config-editor.schema";

export function useUpdateConfigMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (config: Config) => updateConfigJson(config),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: singBoxQueryKeys.configEditor() });
    },
  });
}
