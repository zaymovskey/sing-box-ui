import { type OkResponse } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function deleteSecurityAsset(id: string): Promise<OkResponse> {
  return apiFetch(apiRoutes.securityAssets.delete(id), {
    method: "DELETE",
  });
}
