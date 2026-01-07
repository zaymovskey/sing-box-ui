import { apiRoutes } from "@/shared/lib";

export async function logoutRequest() {
  const res = await fetch(apiRoutes.auth.logout, { method: "POST" });

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return (await res.json()) as unknown;
}
