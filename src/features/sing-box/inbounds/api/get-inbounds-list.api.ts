import { type InboundsListResponse } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getInboundsList(): Promise<InboundsListResponse> {
  return apiFetch(apiRoutes.singBox.inbounds.list, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}
