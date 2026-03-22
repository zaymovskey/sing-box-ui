import { useMutation } from "@tanstack/react-query";

import { type VlessTlsGenerateResponse } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { generateVlessTls } from "../../../api/vless/tls/vless-tls-generate.api";

export function useVlessTlsGenerateMutation() {
  return useMutation<VlessTlsGenerateResponse, ApiError, void>({
    mutationFn: () => generateVlessTls(),
  });
}
