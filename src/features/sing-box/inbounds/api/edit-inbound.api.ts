import { type OkResponse, type SaveInboundInput } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function editInbound(
  internalTag: string,
  body: SaveInboundInput,
): Promise<OkResponse> {
  return apiFetch(apiRoutes.singBox.inbounds.edit(internalTag), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
