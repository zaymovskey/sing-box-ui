"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { useLoginMutation } from "../model/useLoginMutation";

/**
 * Тут нет RHF/zod — чисто минимальный UI.
 * Но запрос уходит через React Query mutation.
 */
export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();

  const next = useMemo(() => sp.get("next") ?? "/", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLoginMutation();

  /**
   * submit:
   * - простая валидация, чтобы не слать пустые поля
   * - mutateAsync даст исключение при ошибке → UI покажет текст
   * - после успеха редиректим
   */
  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) return;

    try {
      await loginMutation.mutateAsync({ email, password });
      toast.success("Toaster Test", {
        description: "description",
        action: {
          label: undefined,
          onClick: () => {},
        },
      });
      router.replace(next);
    } catch {
      toast.error("Toaster Test", {
        description: "description",
        action: {
          label: undefined,
          onClick: () => {},
        },
      });
    }
  }

  const errorText =
    loginMutation.isError && loginMutation.error instanceof Error
      ? loginMutation.error.message
      : null;

  return (
    <div className="w-full max-w-[420px] rounded-xl border border-black/10 p-5">
      <h1 className="mb-4 text-xl font-medium">Вход</h1>

      <form onSubmit={onSubmit} className="grid gap-3">
        {/* Логин */}
        <label className="grid gap-1.5">
          <span className="text-xs text-white/80">Логин</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="admin"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none
                   focus:border-black/20 focus:ring-0 "
          />
        </label>

        {/* Пароль */}
        <label className="grid gap-1.5">
          <span className="text-xs text-white/80">Пароль</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            type="password"
            placeholder="••••••••"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none
                   focus:border-black/20 focus:ring-0"
          />
        </label>

        {/* Ошибка */}
        {errorText ? (
          <div className="text-xs text-red-400">{errorText}</div>
        ) : null}

        {/* Кнопка */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="
        rounded-lg border border-black/10 px-3 py-2 text-sm
        bg-white/5 transition
        hover:bg-white/10
        disabled:cursor-not-allowed disabled:opacity-60
      "
        >
          {loginMutation.isPending ? "Входим..." : "Войти"}
        </button>

        {/* debug next */}
        <div className="text-xs text-white/60">
          next: <code className="text-white/80">{next}</code>
        </div>
      </form>
    </div>
  );
}
