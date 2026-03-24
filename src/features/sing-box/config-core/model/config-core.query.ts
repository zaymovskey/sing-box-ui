import { useQuery } from "@tanstack/react-query";

import { type ConfigWithMetadata } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { getConfigJson } from "../api/config-core.api";
import { singBoxQueryKeys } from "../lib/config-core.query-keys";

export function useConfigQuery() {
  return useQuery<ConfigWithMetadata, ApiError>({
    queryKey: singBoxQueryKeys.config(),
    queryFn: getConfigJson,
    retry: false,
    staleTime: 0,
  });
}
