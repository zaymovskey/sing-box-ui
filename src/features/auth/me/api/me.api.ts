import type { MeResponse } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getMe(): Promise<MeResponse> {
  return apiFetch(apiRoutes.auth.me, {
    method: "GET",
  });
}
