import { useQuery } from "@tanstack/react-query";

import { getMe } from "../api/me.api";
import { authQueryKeys } from "../lib/me.query-keys";
import { meResponseSchema } from "./me.response-schema";

export function useMeQuery() {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: async () => {
      const raw = await getMe();
      return meResponseSchema.parse(raw);
    },
    retry: false,
    staleTime: 60_000,
  });
}
