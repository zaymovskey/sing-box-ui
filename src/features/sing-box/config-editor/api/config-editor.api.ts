import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getConfigText(): Promise<string> {
  return apiFetch(apiRoutes.singBox.configEditor, {
    method: "GET",
    responseMode: "text",
  });
}
