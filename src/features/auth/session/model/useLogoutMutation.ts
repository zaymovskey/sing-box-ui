import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * POST /api/auth/logout
 * Сервер должен удалить cookie (maxAge:0 или expires в прошлом)
 */
async function logoutRequest() {
  const res = await fetch("/api/auth/logout", { method: "POST" });

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return (await res.json()) as unknown;
}

/**
 * useLogoutMutation:
 * - onSuccess → инвалидируем /me
 *   (после этого AuthGuard увидит isError и выкинет на /login)
 */
export function useLogoutMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
