import { useQuery } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type InboundsListResponse } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { getInboundsList } from "../api/get-inbounds-list.api";

export function useInboundsListQuery() {
  return useQuery<InboundsListResponse, ApiError>({
    queryKey: singBoxQueryKeys.inbounds(),
    queryFn: getInboundsList,
    retry: false,
    staleTime: 30_000,
  });
}
