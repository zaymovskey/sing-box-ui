"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { applyFormApiError } from "@/shared/lib";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
  RootErrorMessage,
} from "@/shared/ui";

import {
  LoginFormSchema,
  type LoginFormValues,
} from "../model/login.form-schema";
import { useLoginMutation } from "../model/login.mutation";

/**
 * Тут нет RHF/zod — чисто минимальный UI.
 * Но запрос уходит через React Query mutation.
 */
export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();

  const next = useMemo(() => sp.get("next") ?? "/", [sp]);

  const loginMutation = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
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
    <div className="flex min-h-screen w-full items-center justify-center px-4">
      <div className="w-full max-w-xs">
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h1 className="text-center text-3xl font-semibold tracking-tight">
                    Вход
                  </h1>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field: emailField }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...emailField} placeholder="example@mail.com" />
                      </FormControl>
                      <div className="min-h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field: passwordField }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...passwordField}
                          placeholder="••••••••••••"
                        />
                      </FormControl>
                      <div className="min-h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  loading={loginMutation.isPending}
                >
                  Войти
                </Button>
              </CardContent>
              <CardFooter className="min-h-5 flex-col gap-2">
                <RootErrorMessage />
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
