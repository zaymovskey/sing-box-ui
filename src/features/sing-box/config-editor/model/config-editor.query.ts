import { useQuery } from "@tanstack/react-query";

import { getConfigJson } from "../api/config-editor.api";
import { singBoxQueryKeys } from "../lib/config-editor.query-keys";
import { type configEditorResponse } from "./config-editor.response-schema";

export function useConfigJsonQuery() {
  return useQuery<configEditorResponse>({
    queryKey: singBoxQueryKeys.configEditor(),
    queryFn: getConfigJson,
    retry: false,
    staleTime: 0,
  });
}
