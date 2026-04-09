"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { logoPic } from "@/shared/assets/icons";
import { applyFormApiError, appRoutes } from "@/shared/lib";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  FormProvider,
  RootErrorMessage,
  UncontrolledPasswordField,
  UncontrolledTextField,
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
    <div className="relative flex min-h-screen w-full items-center justify-center px-4">
      <div className="bg-card dark:bg-input/30 dark:border-input absolute top-3 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 rounded-md shadow-md">
        <div className="flex h-20 w-20 items-center justify-center rounded-xl">
          <Image alt="logo" className="h-12 w-12" src={logoPic} />
        </div>
      </div>

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
                <UncontrolledTextField<LoginFormValues>
                  label="Email"
                  name="email"
                  placeholder="example@mail.com"
                />
                <UncontrolledPasswordField<LoginFormValues>
                  label="Пароль"
                  name="password"
                  placeholder="••••••••••••"
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
