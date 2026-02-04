import { useQuery } from "@tanstack/react-query";

import { getConfigText } from "../api/config-editor.api";
import { singBoxQueryKeys } from "../lib/config-editor.query-keys";
import { configEditorResponseSchema } from "./config-editor.response-schema";

export function useConfigTextQuery() {
  return useQuery({
    queryKey: singBoxQueryKeys.configEditor(),
    queryFn: async () => {
      const raw = await getConfigText();
      return configEditorResponseSchema.parse(raw);
    },
    retry: false,
    staleTime: 0,
  });
}
