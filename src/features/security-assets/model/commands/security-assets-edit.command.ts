import { useCallback } from "react";

import {
  type SecurityAsset,
  SecurityAssetSchema,
} from "@/shared/api/contracts";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";
import { mapFormToSecurityAsset } from "../mappers/security-assets.form-mapper";
import { useEditSecurityAssetMutation } from "../mutations/edit-security-assets.mutation";

export const SECURITY_ASSET_INVALID_AFTER_MAPPING =
  "SECURITY_ASSET_INVALID_AFTER_MAPPING";

export function useEditSecurityAsset() {
  const editSecurityAssetMutation = useEditSecurityAssetMutation();

  const editSecurityAsset = useCallback(
    async (
      originalAsset: SecurityAsset,
      updatedSecurityAsset: SecurityAssetFormValues,
    ) => {
      const parsedEditedSecurityAsset = mapFormToSecurityAsset(
        updatedSecurityAsset,
        {
          id: originalAsset.id,
          createdAt: originalAsset.createdAt,
        },
      );

      const securityAssetParseResult = SecurityAssetSchema.safeParse(
        parsedEditedSecurityAsset,
      );

      if (!securityAssetParseResult.success) {
        throw new Error(SECURITY_ASSET_INVALID_AFTER_MAPPING);
      }

      return editSecurityAssetMutation.mutateAsync({
        originalId: originalAsset.id,
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
