import { apiFetch } from "@/shared/lib";

import { type LoginRequestData } from "../model/login.request-schema";

export async function login(body: LoginRequestData) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
