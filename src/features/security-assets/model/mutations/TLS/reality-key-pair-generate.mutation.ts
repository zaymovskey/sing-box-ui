import { useMutation } from "@tanstack/react-query";

import { type RealityKeysPairResponse } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { realityKeyPairGenerate } from "../../../api/Reality/reality-key-pair-generate.api";

export function useGenerateRealityKeysPairMutation() {
  return useMutation<RealityKeysPairResponse, ApiError, void>({
    mutationFn: () => realityKeyPairGenerate(),
  });
}
