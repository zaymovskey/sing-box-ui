import { type SingBoxStatusResponse } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getSingBoxStatus(): Promise<SingBoxStatusResponse> {
  return apiFetch(apiRoutes.singBox.status, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}
