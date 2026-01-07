"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authQueryKeys } from "../../me/lib/me.query-keys";
import { logoutRequest } from "../api/logoutRequest";

export function useLogoutMutation() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: async () => {
      qc.removeQueries({ queryKey: authQueryKeys.me() });
      await qc.cancelQueries({ queryKey: authQueryKeys.me() });
      router.replace("/login");
    },
  });
}
