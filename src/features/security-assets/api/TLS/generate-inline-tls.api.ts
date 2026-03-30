import {
  type TLSInlineGenerateRequest,
  type TLSInlineGenerateResponse,
} from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function generateInlineTLS(
  body: TLSInlineGenerateRequest,
): Promise<TLSInlineGenerateResponse> {
  return apiFetch(apiRoutes.securityAssets.tls.inline.generate, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
