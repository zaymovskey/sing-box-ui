import { useQuery } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type InboundsStatsResponse } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { getInboundsStats } from "../api/get-inbounds-stats.api";

export function useInboundsStatsQuery() {
  return useQuery<InboundsStatsResponse, ApiError>({
    queryKey: singBoxQueryKeys.inboundsStats(),
    queryFn: getInboundsStats,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 4000,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
