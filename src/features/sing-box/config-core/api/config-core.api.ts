import { type Config } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getConfigJson(): Promise<Config> {
  return apiFetch<Config>(apiRoutes.singBox.configEditor, {
    method: "GET",
  });
}

export async function updateConfigJson(body: Config): Promise<void> {
  return apiFetch(apiRoutes.singBox.configEditor, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
