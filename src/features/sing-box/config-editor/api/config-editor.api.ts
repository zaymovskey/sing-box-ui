import { apiFetch, apiRoutes } from "@/shared/lib";

export async function getConfigJson(): Promise<string> {
  return apiFetch(apiRoutes.singBox.configEditor, {
    method: "GET",
  });
}
