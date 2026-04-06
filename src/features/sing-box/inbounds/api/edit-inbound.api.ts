import { type OkResponse, type SaveInboundInput } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function editInbound(
  originalTag: string,
  body: SaveInboundInput,
): Promise<OkResponse> {
  return apiFetch(apiRoutes.singBox.inbounds.edit(originalTag), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
