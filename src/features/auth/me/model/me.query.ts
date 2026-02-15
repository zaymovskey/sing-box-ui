import { useQuery } from "@tanstack/react-query";

import { MeResponseSchema } from "@/shared/api/contracts";

import { getMe } from "../api/me.api";
import { authQueryKeys } from "../lib/me.query-keys";

export function useMeQuery() {
  return useQuery({
    queryKey: authQueryKeys.me(),
    queryFn: async () => {
      const raw = await getMe();
      return MeResponseSchema.parse(raw);
    },
    retry: false,
    staleTime: 60_000,
  });
}
