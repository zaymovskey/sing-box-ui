import { type LoginRequest } from "@/shared/api/contracts";
import { apiFetch, apiRoutes } from "@/shared/lib";

export async function login(body: LoginRequest) {
  return apiFetch(apiRoutes.auth.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
