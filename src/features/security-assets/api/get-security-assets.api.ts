import {
  type SecurityAssets,
  type SecurityAssetType,
} from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getSecurityAssets(params?: {
  type: SecurityAssetType;
}): Promise<SecurityAssets> {
  const search = new URLSearchParams();

  if (params?.type) {
    search.set("type", params.type);
  }
  return apiFetch(`${apiRoutes.securityAssets.list}?${search.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}
