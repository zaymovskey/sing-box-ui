import { useQuery } from "@tanstack/react-query";

import { authQueryKeys } from "../lib/me.query-keys";

/**
 * DTO пользователя, который возвращает /api/auth/me
 */
export type MeDto = {
  id: string;
  email: string;
  role?: "admin" | "user";
};

/**
 * Запрос на сервер: "кто я?"
 * - Если 200 → возвращаем профиль
 * - Если 401/403 → считаем "не авторизован" (это состояние, а не краш)
 */
async function fetchMe(): Promise<MeDto> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(String(res.status));
  }

  return (await res.json()) as MeDto;
}

/**
 * useMeQuery:
 * - retry=false: на 401 бессмысленно долбиться повторно
 * - staleTime: чтобы не дергать /me на каждом чихе
 */
export function useMeQuery() {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: fetchMe,
    retry: false,
    staleTime: 30_000,
  });
}
