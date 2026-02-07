"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ApiError, appRoutes } from "@/shared/lib";

import { useMeQuery } from "../model/me.query";

type Props = { children: React.ReactNode };

function isUnauthorized(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

function isForbidden(error: unknown) {
  return error instanceof ApiError && error.status === 403;
}

export function AuthGate({ children }: Props) {
  const router = useRouter();
  const { data, error, isLoading, refetch, isFetching } = useMeQuery();

  useEffect(() => {
    if (isUnauthorized(error)) {
      router.replace(appRoutes.login);
    }
  }, [error, router]);

  if (isLoading) return null;

  if (isUnauthorized(error)) return null;

  if (isForbidden(error)) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Нет доступа</h1>
        <p className="mt-2 text-sm opacity-80">
          У вашей учётной записи нет прав для входа в панель.
        </p>
      </div>
    );
  }

  // Любая другая ошибка (5xx / сеть / парсинг)
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Не удалось проверить сессию</h1>
        <p className="mt-2 text-sm opacity-80">
          Похоже на проблему сети или сервера. Попробуй ещё раз.
        </p>

        <button
          className="mt-4 rounded-md border px-3 py-2 text-sm"
          disabled={isFetching}
          onClick={() => refetch()}
        >
          {isFetching ? "Проверяю..." : "Повторить"}
        </button>
      </div>
    );
  }

  if (!data) return null;

  return <>{children}</>;
}
