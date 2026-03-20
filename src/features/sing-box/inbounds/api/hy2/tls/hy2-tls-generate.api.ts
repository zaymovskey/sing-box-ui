import {
  type Hy2TlsGenerateRequest,
  type Hy2TlsGenerateResponse,
} from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function generateHy2Tls(
  body: Hy2TlsGenerateRequest,
): Promise<Hy2TlsGenerateResponse> {
  return apiFetch(apiRoutes.singBox.hy2.tls.generate, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
