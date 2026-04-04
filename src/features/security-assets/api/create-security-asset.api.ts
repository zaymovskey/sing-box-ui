import { type OkResponse, type SecurityAsset } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function createSecurityAsset(
  body: SecurityAsset,
): Promise<OkResponse> {
  return apiFetch(apiRoutes.securityAssets.create, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
