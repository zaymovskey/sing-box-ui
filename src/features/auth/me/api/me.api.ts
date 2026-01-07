import { apiFetch } from "@/shared/lib";

import type { MeResponse } from "../model/me.response-schema";

export async function getMe(): Promise<MeResponse> {
  return apiFetch("/api/auth/me", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
}
