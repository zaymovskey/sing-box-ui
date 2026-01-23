import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authQueryKeys } from "../../me/lib/me.query-keys";
import { login } from "../api/login.api";
import { type LoginRequestData } from "./login.request-schema";
import { LoginResponseSchema } from "./login.response-schema";

/**
 * useLoginMutation:
 * - onSuccess → сбрасываем кеш /me, чтобы UI увидел "я залогинен"
 */
export function useLoginMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: LoginRequestData) => {
      const raw = await login(body);
      return LoginResponseSchema.parse(raw);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: authQueryKeys.me() });
    },
  });
}
