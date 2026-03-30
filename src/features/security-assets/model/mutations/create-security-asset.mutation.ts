import { useMutation, useQueryClient } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type OkResponse, type SecurityAsset } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { createSecurityAsset } from "../../api/create-security-asset.api";

export function useCreateSecurityAssetMutation() {
  const qc = useQueryClient();

  return useMutation<OkResponse, ApiError, SecurityAsset>({
    mutationFn: (securityAsset) => createSecurityAsset(securityAsset),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: singBoxQueryKeys.securityAssets(),
      });
    },
  });
}
