import { useQuery } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type SecurityAssets } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { getSecurityAssets } from "../api/get-security-assets.api";

export function useSecurityAssetsListQuery() {
  return useQuery<SecurityAssets, ApiError>({
    queryKey: singBoxQueryKeys.securityAssets(),
    queryFn: getSecurityAssets,
    retry: false,
    staleTime: 0,
  });
}
