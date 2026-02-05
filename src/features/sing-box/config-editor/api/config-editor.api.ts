import { apiFetch, apiRoutes } from "@/shared/lib";

import { type ConfigEditorRequestData } from "../model/config-editor.response-schema";

export async function getConfigJson(): Promise<ConfigEditorRequestData> {
  return apiFetch<ConfigEditorRequestData>(apiRoutes.singBox.configEditor, {
    method: "GET",
  });
}

export async function updateConfigJson(
  body: ConfigEditorRequestData,
): Promise<void> {
  return apiFetch(apiRoutes.singBox.configEditor, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
