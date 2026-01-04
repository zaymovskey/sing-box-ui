import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Payload для /api/auth/login
 */
export type LoginBody = {
  email: string;
  password: string;
};

/**
 * POST /api/auth/login
 * Сервер ставит HttpOnly cookie (JWT) — клиент токен не видит и не хранит
 */
async function loginRequest(body: LoginBody) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || String(res.status));
  }

  return (await res.json()) as unknown;
}

/**
 * useLoginMutation:
 * - onSuccess → сбрасываем кеш /me, чтобы UI увидел "я залогинен"
 */
export function useLoginMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
