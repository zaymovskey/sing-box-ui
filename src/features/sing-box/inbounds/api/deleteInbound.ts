import { type OkResponse } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function deleteInbound(tag: string): Promise<OkResponse> {
  return apiFetch(apiRoutes.singBox.inbounds.delete(tag), {
    method: "DELETE",
  });
}
