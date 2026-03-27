import { type DraftInbound, type OkResponse } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function editInbound(
  originalTag: string,
  body: DraftInbound,
): Promise<OkResponse> {
  return apiFetch(apiRoutes.singBox.inbounds.edit(originalTag), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
