import { useQuery } from "@tanstack/react-query";

import { meResponseSchema } from "@/shared/api/contracts";

import { getMe } from "../api/me.api";
import { authQueryKeys } from "../lib/me.query-keys";

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
