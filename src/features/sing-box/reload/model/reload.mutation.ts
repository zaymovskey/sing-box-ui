import { useMutation } from "@tanstack/react-query";

import { type OkResponse } from "@/shared/api/contracts";
import { type ApiError } from "@/shared/lib";

import { reloadSingBox } from "../api/reload.api";

export function useReloadSingBox() {
  return useMutation<OkResponse, ApiError, void>({
    mutationFn: () => reloadSingBox(),
  });
}
