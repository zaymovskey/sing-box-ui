import { type StoredInbound } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getInboundByInternalTag(
  internalTag: string,
): Promise<StoredInbound> {
  return apiFetch(apiRoutes.singBox.inbounds.get(internalTag), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}
