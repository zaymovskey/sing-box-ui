import { useQuery } from "@tanstack/react-query";

import { type DraftConfig } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { getDraftJson } from "../api/config-core.api";
import { singBoxQueryKeys } from "../lib/config-core.query-keys";

export function useConfigQuery() {
  return useQuery<DraftConfig, ApiError>({
    queryKey: singBoxQueryKeys.config(),
    queryFn: getDraftJson,
    retry: false,
    staleTime: 0,
  });
}
