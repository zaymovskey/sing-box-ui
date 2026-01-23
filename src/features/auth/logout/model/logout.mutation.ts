"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { appRoutes } from "@/shared/lib";

import { authQueryKeys } from "../../me/lib/me.query-keys";
import { logout } from "../api/logout.api";

export function useLogoutMutation() {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      qc.removeQueries({ queryKey: authQueryKeys.me() });
      await qc.cancelQueries({ queryKey: authQueryKeys.me() });
      router.replace(appRoutes.login);
    },
  });
}
