import { useCallback } from "react";

import { SecurityAssetSchema } from "@/shared/api/contracts";

import { type SecurityAssetFormValues } from "../../model/security-asset-form.schema";
import { mapFormToSecurityAsset } from "../mappers/security-assets.form-mapper";
import { useCreateSecurityAssetMutation } from "../mutations/create-security-asset.mutation";

export const SECURITY_ASSET_INVALID_AFTER_MAPPING =
  "SECURITY_ASSET_INVALID_AFTER_MAPPING";

export function useCreateSecurityAsset() {
  const createSecurityAssetMutation = useCreateSecurityAssetMutation();

  const createSecurityAsset = useCallback(
    async (newSecurityAsset: SecurityAssetFormValues) => {
      const parsedNewSecurityAsset = mapFormToSecurityAsset(newSecurityAsset);

      const securityAssetParseResult = SecurityAssetSchema.safeParse(
        parsedNewSecurityAsset,
      );

      if (!securityAssetParseResult.success) {
        throw new Error(SECURITY_ASSET_INVALID_AFTER_MAPPING);
      }

      return createSecurityAssetMutation.mutateAsync(
        securityAssetParseResult.data,
      );
    },
    [createSecurityAssetMutation],
  );

  return {
    createSecurityAsset,
    isPending: createSecurityAssetMutation.isPending,
  };
}
