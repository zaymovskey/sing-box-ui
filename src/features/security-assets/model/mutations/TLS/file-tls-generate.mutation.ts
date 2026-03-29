import { useMutation } from "@tanstack/react-query";

import {
  type TLSFileGenerateRequest,
  type TLSFileGenerateResponse,
} from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { generateFileTLS } from "../../../api/TLS/generate-file.api";

export function useFileTLSGenerateMutation() {
  return useMutation<TLSFileGenerateResponse, ApiError, TLSFileGenerateRequest>(
    {
      mutationFn: (body) => generateFileTLS(body),
    },
  );
}
