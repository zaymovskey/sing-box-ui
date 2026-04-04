import { useMutation } from "@tanstack/react-query";

import {
  type TLSInlineGenerateRequest,
  type TLSInlineGenerateResponse,
} from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { generateInlineTLS } from "../../../api/TLS/generate-inline-tls.api";

export function useGenerateInlineTLSMutation() {
  return useMutation<
    TLSInlineGenerateResponse,
    ApiError,
    TLSInlineGenerateRequest
  >({
    mutationFn: (body) => generateInlineTLS(body),
  });
}
