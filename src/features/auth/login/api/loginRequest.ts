import { ApiError, readErrorMessage } from "@/shared/lib";

import { type LoginRequestData } from "../model/login.request-schema";

export async function loginRequest(body: LoginRequestData) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const { message, payload } = await readErrorMessage(res);
    throw new ApiError(res.status, message, payload);
  }

  return res.json() as Promise<unknown>;
}
