import { useMutation, useQueryClient } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type OkResponse } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { deleteSecurityAsset } from "../../api/delete-security-assets.api";

export function useDeleteSecurityAssetMutation() {
  const qc = useQueryClient();

  return useMutation<OkResponse, ApiError, string>({
    mutationFn: (id) => deleteSecurityAsset(id),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: singBoxQueryKeys.securityAssets(),
      });
    },
  });
}
