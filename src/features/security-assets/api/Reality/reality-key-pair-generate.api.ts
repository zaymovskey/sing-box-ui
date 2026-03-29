import { type RealityKeysPairResponse } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function realityKeyPairGenerate(): Promise<RealityKeysPairResponse> {
  return apiFetch(apiRoutes.securityAssets.reality.keysPairGenerate, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
}
