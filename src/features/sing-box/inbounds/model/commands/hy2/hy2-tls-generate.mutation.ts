import { useMutation } from "@tanstack/react-query";

import {
  type Hy2TlsGenerateRequest,
  type Hy2TlsGenerateResponse,
} from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { generateHy2Tls } from "../../../api/hy2/tls/hy2-tls-generate.api";

export function useHy2TlsGenerateMutation() {
  return useMutation<Hy2TlsGenerateResponse, ApiError, Hy2TlsGenerateRequest>({
    mutationFn: (body) => generateHy2Tls(body),
  });
}
