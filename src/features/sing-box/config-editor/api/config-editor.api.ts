import { apiFetch, apiRoutes } from "@/shared/lib";

import { type Config } from "../model/config-editor.schema";

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
