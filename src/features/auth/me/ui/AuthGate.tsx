"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ApiError } from "@/shared/lib";

import { useMeQuery } from "../model/me.query";

type Props = {
  children: React.ReactNode;
};

export function AuthGate({ children }: Props) {
  const router = useRouter();
  const { data, error, isLoading } = useMeQuery();

  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      router.replace("/login");
    }
  }, [error, router]);

  if (isLoading) return null;

  if (!data) return null;

  return <>{children}</>;
}
