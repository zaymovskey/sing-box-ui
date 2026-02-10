import { useQuery } from "@tanstack/react-query";

import { getConfigJson } from "../api/config-core.api";
import { singBoxQueryKeys } from "../lib/config-core.query-keys";
import { type Config } from "./config-core.schema";

export function useConfigQuery() {
  return useQuery<Config>({
    queryKey: singBoxQueryKeys.config(),
    queryFn: getConfigJson,
    retry: false,
    staleTime: 0,
  });
}
