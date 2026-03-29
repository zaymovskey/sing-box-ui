import { type OkResponse, type SecurityAsset } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function editSecurityAsset(
  originalId: string,
  body: SecurityAsset,
): Promise<OkResponse> {
  return apiFetch(apiRoutes.securityAssets.edit(originalId), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
