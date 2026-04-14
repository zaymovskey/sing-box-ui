import {
  type DiagnosticKey,
  type InboundDiagnosticResponse,
} from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function runInboundDiagnostic(
  internalTag: string,
  diagnostics: DiagnosticKey[],
): Promise<InboundDiagnosticResponse> {
  return apiFetch(apiRoutes.singBox.inbounds.diagnostic(internalTag), {
    method: "POST",
    body: JSON.stringify({ diagnostics }),
    headers: { "Content-Type": "application/json" },
  });
}
