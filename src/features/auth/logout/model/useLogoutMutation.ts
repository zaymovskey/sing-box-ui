"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { logoutRequest } from "../api/logoutRequest";

const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

export function useLogoutMutation() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: async () => {
      qc.removeQueries({ queryKey: AUTH_ME_QUERY_KEY });
      await qc.cancelQueries({ queryKey: AUTH_ME_QUERY_KEY });
      router.replace("/login");
    },
  });
}
