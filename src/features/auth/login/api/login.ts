import { type LoginData } from "../model/login.request-schema";

export async function loginRequest(body: LoginData) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || String(res.status));
  }

  return res.json() as Promise<unknown>;
}
