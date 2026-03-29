import {
  type TLSFileGenerateRequest,
  type TLSFileGenerateResponse,
} from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function generateFileTLS(
  body: TLSFileGenerateRequest,
): Promise<TLSFileGenerateResponse> {
  return apiFetch(apiRoutes.singBox.inbounds.hy2.tls.generate, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
