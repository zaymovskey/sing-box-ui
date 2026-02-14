import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type LoginRequest, OkResponseSchema } from "@/shared/api/contracts";

import { authQueryKeys } from "../../me/lib/me.query-keys";
import { login } from "../api/login.api";

/**
 * useLoginMutation:
 * - onSuccess → сбрасываем кеш /me, чтобы UI увидел "я залогинен"
 */
export function useLoginMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const raw = await login(body);
      return OkResponseSchema.parse(raw);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: authQueryKeys.me() });
    },
  });
}
