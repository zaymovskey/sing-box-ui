import { apiFetch, apiRoutes } from "@/shared/lib";

import { type configEditorResponse } from "../model/config-editor.response-schema";

export async function getConfigJson(): Promise<configEditorResponse> {
  return apiFetch<configEditorResponse>(apiRoutes.singBox.configEditor, {
    method: "GET",
  });
}
