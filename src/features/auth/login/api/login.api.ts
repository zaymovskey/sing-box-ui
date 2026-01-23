import { apiFetch, apiRoutes } from "@/shared/lib";

import { type LoginRequestData } from "../model/login.request-schema";

export async function login(body: LoginRequestData) {
  return apiFetch(apiRoutes.auth.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
