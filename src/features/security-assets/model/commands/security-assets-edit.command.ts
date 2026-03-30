import { useCallback } from "react";

import { SecurityAssetSchema } from "@/shared/api/contracts";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";
import { mapFormToSecurityAsset } from "../mappers/security-assets.form-mapper";
import { useEditSecurityAssetMutation } from "../mutations/edit-security-assets.mutation";

export const SECURITY_ASSET_INVALID_AFTER_MAPPING =
  "SECURITY_ASSET_INVALID_AFTER_MAPPING";

export function useEditSecurityAsset() {
  const editSecurityAssetMutation = useEditSecurityAssetMutation();

  const editSecurityAsset = useCallback(
    async (
      originalId: string,
      updatedSecurityAsset: SecurityAssetFormValues,
    ) => {
      const parsedEditedSecurityAsset =
        mapFormToSecurityAsset(updatedSecurityAsset);

      const securityAssetParseResult = SecurityAssetSchema.safeParse(
        parsedEditedSecurityAsset,
      );

      if (!securityAssetParseResult.success) {
        throw new Error(SECURITY_ASSET_INVALID_AFTER_MAPPING);
      }

      return editSecurityAssetMutation.mutateAsync({
        originalId,
        asset: securityAssetParseResult.data,
      });
    },
    [editSecurityAssetMutation],
  );

  return {
    editSecurityAsset,
    isPending: editSecurityAssetMutation.isPending,
  };
}
