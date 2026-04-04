import { type SecurityAsset } from "@/shared/api/contracts";

import { type SecurityAssetRow } from "../model/security-assets-row.type";

export function mapSecurityAssetsListToRows(
  assets: SecurityAsset[],
): SecurityAssetRow[] {
  return assets.map((asset) => ({
    name: asset.name,
    type: asset.type,
    serverName: asset.serverName ?? null,
    sourceType: asset.type === "tls" ? asset.source.sourceType : null,
    updatedAt: asset.updatedAt,
    securityAsset: asset,
  }));
}
