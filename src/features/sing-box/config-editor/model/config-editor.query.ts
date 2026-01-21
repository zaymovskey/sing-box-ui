import { useQuery } from "@tanstack/react-query";

import { getConfig } from "../api/config-editor.api";
import { singBoxQueryKeys } from "../lib/config-editor.query-keys";
import { configEditorResponseSchema } from "./config-editor.response-schema";

export function useConfigEditorQuery() {
  return useQuery({
    queryKey: singBoxQueryKeys.configEditor(),
    queryFn: async () => {
      const raw = await getConfig();
      return configEditorResponseSchema.parse(raw);
    },
    retry: false,
    staleTime: 0,
  });
}
