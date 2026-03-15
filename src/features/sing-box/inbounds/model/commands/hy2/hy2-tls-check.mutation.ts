import { useMutation } from "@tanstack/react-query";

import {
  type Hy2TlsCheckRequest,
  type Hy2TlsCheckResponse,
} from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { checkHy2Tls } from "../../../api/hy2/tls/hy2-tls-check.api";

export function useHy2TlsCheckMutation() {
  return useMutation<Hy2TlsCheckResponse, ApiError, Hy2TlsCheckRequest>({
    mutationFn: (body) => checkHy2Tls(body),
  });
}
