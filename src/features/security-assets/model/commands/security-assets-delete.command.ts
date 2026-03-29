import { useCallback } from "react";

import { useDeleteSecurityAssetMutation } from "../mutations/delete-security-asset.mutation";

export function useDeleteSecurityAsset() {
  const deleteSecurityAssetMutation = useDeleteSecurityAssetMutation();

  const deleteSecurityAsset = useCallback(
    async (id: string) => {
      return deleteSecurityAssetMutation.mutateAsync(id);
    },
    [deleteSecurityAssetMutation],
  );

  return {
    deleteSecurityAsset,
    isPending: deleteSecurityAssetMutation.isPending,
  };
}
