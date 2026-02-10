"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { applyFormApiError, appRoutes } from "@/shared/lib";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider,
  Input,
  PasswordInput,
  RootErrorMessage,
} from "@/shared/ui";

import {
  LoginFormSchema,
  type LoginFormValues,
} from "../model/login.form-schema";
import { useLoginMutation } from "../model/login.mutation";

export function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();

  const next = useMemo(() => sp.get("next") ?? appRoutes.inbounds, [sp]);

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
        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
            <Card className="gap-3">
              <CardHeader>
                <CardTitle className="border-b pb-3">
                  <h1 className="text-center text-3xl font-semibold tracking-tight">
                    Вход
                  </h1>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field: emailField }) => (
                    <FormItem className="gap-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...emailField}
                          placeholder="example@mail.com"
                          onChange={(e) => {
                            form.clearErrors("root");
                            emailField.onChange(e);
                          }}
                        />
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
                    <FormItem className="gap-2">
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...passwordField}
                          placeholder="••••••••••••"
                          onChange={(e) => {
                            form.clearErrors("root");
                            passwordField.onChange(e);
                          }}
                        />
                      </FormControl>
                      <div className="min-h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  className="w-full"
                  disabled={loginMutation.isPending}
                  loading={loginMutation.isPending}
                  type="submit"
                >
                  Войти
                </Button>
              </CardContent>
              <CardFooter className="min-h-5 flex-col">
                <RootErrorMessage />
              </CardFooter>
            </Card>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
