export async function logoutRequest() {
  const res = await fetch("/api/auth/logout", { method: "POST" });

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return (await res.json()) as unknown;
}
