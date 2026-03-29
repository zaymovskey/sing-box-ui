import { type SecurityAssets } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getSecurityAssets(): Promise<SecurityAssets> {
  return apiFetch(apiRoutes.securityAssets.list, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}
