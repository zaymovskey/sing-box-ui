import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

type QueryParamValue = string | null | undefined;

export function useUpdateQueryParams<TKey extends string>() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (updates: Partial<Record<TKey, QueryParamValue>>) => {
      const params = new URLSearchParams(window.location.search);

      (Object.keys(updates) as TKey[]).forEach((key) => {
        const value = updates[key];

        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const nextQuery = params.toString();
      const currentQuery = window.location.search.slice(1);

      if (nextQuery === currentQuery) return;

      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl);
    },
    [pathname, router],
  );
}
