import {
  type TLSFileCheckRequest,
  type TLSFileCheckResponse,
} from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function checkFileTLS(
  body: TLSFileCheckRequest,
): Promise<TLSFileCheckResponse> {
  return apiFetch(apiRoutes.securityAssets.tls.file.check, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
