import { type InboundsStatsResponse } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getInboundsStats(): Promise<InboundsStatsResponse> {
  return apiFetch(apiRoutes.singBox.inbounds.stats, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}
