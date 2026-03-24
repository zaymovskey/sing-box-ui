import { type ConfigWithMetadata } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getConfigJson(): Promise<ConfigWithMetadata> {
  return apiFetch<ConfigWithMetadata>(apiRoutes.singBox.configEditor, {
    method: "GET",
  });
}

export async function updateConfigJson(
  body: ConfigWithMetadata,
): Promise<void> {
  return apiFetch(apiRoutes.singBox.configEditor, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
