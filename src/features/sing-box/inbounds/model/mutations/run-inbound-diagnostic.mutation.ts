import { useMutation } from "@tanstack/react-query";

import {
  type DiagnosticKey,
  type InboundDiagnosticResponse,
} from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { runInboundDiagnostic } from "../../api/run-inbound-diagnostic.api";

export function useRunInboundDiagnosticMutation() {
  return useMutation<
    InboundDiagnosticResponse,
    ApiError,
    { internalTag: string; diagnostics: DiagnosticKey[] }
  >({
    mutationFn: ({ internalTag, diagnostics }) =>
      runInboundDiagnostic(internalTag, diagnostics),
  });
}
