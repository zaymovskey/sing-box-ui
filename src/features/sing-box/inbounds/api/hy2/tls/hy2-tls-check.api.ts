import {
  type Hy2TlsCheckRequest,
  type Hy2TlsCheckResponse,
} from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function checkHy2Tls(
  body: Hy2TlsCheckRequest,
): Promise<Hy2TlsCheckResponse> {
  return apiFetch(apiRoutes.singBox.hy2.tls.check, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
