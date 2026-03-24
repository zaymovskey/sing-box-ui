import { useQuery } from "@tanstack/react-query";

import { singBoxQueryKeys } from "@/features/sing-box/config-core";
import { type SingBoxStatusResponse } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { getSingBoxStatus } from "../api/get-sing-box-status.api";

export function useSingBoxStatusQuery() {
  return useQuery<SingBoxStatusResponse, ApiError>({
    queryKey: singBoxQueryKeys.status(),
    queryFn: getSingBoxStatus,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  });
}
