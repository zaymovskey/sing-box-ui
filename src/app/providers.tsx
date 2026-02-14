"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as React from "react";
import { useState } from "react";

import { ApiError } from "@/shared/lib";
import { infraToast, sonnerErrorCloseButton, Toaster } from "@/shared/ui";

type ProvidersProps = {
  children: React.ReactNode;
};

const errorToMessage = (e: unknown) => {
  if (e instanceof ApiError) return e.uiMessage;
  return "Неизвестная ошибка";
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
        mutationCache: new MutationCache({
          onError: (err, _vars, _ctx, mutation) => {
            if (mutation.meta?.silent) return;

            infraToast.error(errorToMessage(err), {
              id: `m:${mutation.options.mutationKey?.join?.(":") ?? "mutation"}`,
              position: "bottom-left",
              ...sonnerErrorCloseButton,
            });
          },
        }),
        queryCache: new QueryCache({
          onError: (err, query) => {
            if (query.meta?.silent) return;

            infraToast.error(errorToMessage(err), {
              id: `q:${query.queryHash}`,
              position: "bottom-left",
              ...sonnerErrorCloseButton,
            });
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
