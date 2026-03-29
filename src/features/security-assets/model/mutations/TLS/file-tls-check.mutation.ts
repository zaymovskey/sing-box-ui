import { useMutation } from "@tanstack/react-query";

import {
  type TLSFileCheckRequest,
  type TLSFileCheckResponse,
} from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { checkFileTLS } from "../../../api/TLS/check-file-tls.api";

export function useFileTLSCheckMutation() {
  return useMutation<TLSFileCheckResponse, ApiError, TLSFileCheckRequest>({
    mutationFn: (body) => checkFileTLS(body),
  });
}
