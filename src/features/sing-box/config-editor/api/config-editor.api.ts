import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getConfig(): Promise<string> {
  return apiFetch(apiRoutes.singBox.configEditor, {
    method: "GET",
  });
}
