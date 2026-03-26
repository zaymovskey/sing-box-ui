import { type DraftConfig } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getDraftJson(): Promise<DraftConfig> {
  return apiFetch<DraftConfig>(apiRoutes.singBox.configEditor, {
    method: "GET",
  });
}

export async function updateConfigJson(body: DraftConfig): Promise<void> {
  return apiFetch(apiRoutes.singBox.configEditor, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
