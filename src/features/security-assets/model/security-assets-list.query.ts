import { useQuery } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import {
  type SecurityAssets,
  type SecurityAssetType,
} from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { getSecurityAssets } from "../api/get-security-assets.api";

export function useSecurityAssetsListQuery(params?: {
  type: SecurityAssetType;
}) {
  return useQuery<SecurityAssets, ApiError>({
    queryKey: singBoxQueryKeys.securityAssets(params?.type),
    queryFn: () => getSecurityAssets(params),
    retry: false,
    staleTime: 0,
  });
}
