import { type VlessTlsGenerateResponse } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function generateVlessTls(): Promise<VlessTlsGenerateResponse> {
  return apiFetch(apiRoutes.singBox.vless.tls.generate, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
}
