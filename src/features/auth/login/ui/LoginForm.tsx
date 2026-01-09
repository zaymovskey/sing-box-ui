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
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>
              <h1 className="text-center text-2xl font-semibold tracking-tight">
                Вход
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field: emailField }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...emailField} />
                  </FormControl>
                  <FormMessage />
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
                    <Input type="password" {...passwordField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Войти</Button>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <RootErrorMessage />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
