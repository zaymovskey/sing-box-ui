import { type OkResponse, type StoredInbound } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function createInbound(body: StoredInbound): Promise<OkResponse> {
  return apiFetch(apiRoutes.singBox.inbounds.create, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
