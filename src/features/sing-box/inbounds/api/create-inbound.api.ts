import { type OkResponse, type SaveInboundInput } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function createInbound(
  body: SaveInboundInput,
): Promise<OkResponse> {
  return apiFetch(apiRoutes.singBox.inbounds.create, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
