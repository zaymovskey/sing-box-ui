import { useQuery } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type StoredInbound } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { getInboundByInternalTag } from "../api/get-inbound-by-internal-tag.api";

export function useInboundQuery(internalTag: string) {
  return useQuery<StoredInbound, ApiError>({
    queryKey: singBoxQueryKeys.inbound(internalTag),
    queryFn: () => getInboundByInternalTag(internalTag),
    enabled: internalTag.trim().length > 0,
    retry: false,
    staleTime: 30_000,
  });
}
