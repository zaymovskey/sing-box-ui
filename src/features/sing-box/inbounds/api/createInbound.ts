import { type DraftInbound, type OkResponse } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function createInbound(body: DraftInbound): Promise<OkResponse> {
  return apiFetch(apiRoutes.singBox.inbounds.create, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
