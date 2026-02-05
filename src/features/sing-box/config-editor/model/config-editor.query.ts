import { useQuery } from "@tanstack/react-query";

import { getConfigJson } from "../api/config-editor.api";
import { singBoxQueryKeys } from "../lib/config-editor.query-keys";
import { type Config } from "./config-editor.schema";

export function useConfigQuery() {
  return useQuery<Config>({
    queryKey: singBoxQueryKeys.configEditor(),
    queryFn: getConfigJson,
    retry: false,
    staleTime: 0,
  });
}
