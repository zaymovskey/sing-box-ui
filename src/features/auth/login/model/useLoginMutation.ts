import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loginRequest } from "../api/login";
import {
  type LoginResponse,
  LoginResponseSchema,
} from "./login.response-schema";
import { type LoginData } from "./login.schema";

/**
 * useLoginMutation:
 * - onSuccess → сбрасываем кеш /me, чтобы UI увидел "я залогинен"
 */
export function useLoginMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (body: LoginData) => {
      const raw = await loginRequest(body);
      return LoginResponseSchema.parse(raw) as LoginResponse;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
