import { type OkResponse } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export function reloadSingBox(): Promise<OkResponse> {
  return apiFetch(apiRoutes.singBox.reload, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
}
