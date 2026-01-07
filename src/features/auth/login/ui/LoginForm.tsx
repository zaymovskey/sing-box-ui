"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { applyFormApiError } from "@/shared/lib";

import { useLoginMutation } from "../model/login.mutation";
import {
  type LoginRequestData,
  LoginRequestSchema,
} from "../model/login.request-schema";

/**
 * Тут нет RHF/zod — чисто минимальный UI.
 * Но запрос уходит через React Query mutation.
 */
export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();

  const next = useMemo(() => sp.get("next") ?? "/", [sp]);

  const loginMutation = useLoginMutation();

  const form = useForm<LoginRequestData>({
    resolver: zodResolver(LoginRequestSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await loginMutation.mutateAsync(data);
      router.replace(next);
    } catch (e) {
      applyFormApiError(form, e, {
        401: "Неверный логин или пароль",
        403: "Доступ запрещён",
        429: "Слишком много попыток. Попробуй позже.",
      });
    }
  });

  return (
    <div className="w-full max-w-[420px] rounded-xl border border-black/10 p-5">
      <h1 className="mb-4 text-xl font-medium">Вход</h1>

      <form onSubmit={onSubmit} className="grid gap-3">
        {/* Логин */}
        <label className="grid gap-1.5">
          <span className="text-xs text-white/80">Логин</span>
          <input
            {...form.register("email")}
            autoComplete="username"
            placeholder="admin"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none
                   focus:border-black/20 focus:ring-0 "
          />
          {form.formState.errors.email?.message ? (
            <div className="text-xs text-red-400">
              {form.formState.errors.email.message}
            </div>
          ) : null}
        </label>

        {/* Пароль */}
        <label className="grid gap-1.5">
          <span className="text-xs text-white/80">Пароль</span>
          <input
            {...form.register("password")}
            autoComplete="current-password"
            type="password"
            placeholder="••••••••"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none
                   focus:border-black/20 focus:ring-0"
          />
          {form.formState.errors.password?.message ? (
            <div className="text-xs text-red-400">
              {form.formState.errors.password.message}
            </div>
          ) : null}
        </label>

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

        {form.formState.errors.root?.message ? (
          <div className="text-xs text-red-400">
            {form.formState.errors.root.message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
