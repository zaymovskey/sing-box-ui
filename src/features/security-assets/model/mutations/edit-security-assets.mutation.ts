import { useMutation, useQueryClient } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type OkResponse, type SecurityAsset } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { editSecurityAsset } from "../../api/edit-security-asset.api";

type EditSecurityAssetVariables = {
  originalId: string;
  asset: SecurityAsset;
};

export function useEditSecurityAssetMutation() {
  const qc = useQueryClient();

  return useMutation<OkResponse, ApiError, EditSecurityAssetVariables>({
    mutationFn: ({ originalId, asset }) => editSecurityAsset(originalId, asset),

    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: singBoxQueryKeys.securityAssets(),
      });
    },
  });
}
