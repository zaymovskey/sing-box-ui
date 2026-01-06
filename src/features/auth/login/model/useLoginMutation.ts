import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loginRequest } from "../api/loginRequest";
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
      const raw = await loginRequest(body);
      return LoginResponseSchema.parse(raw);
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
