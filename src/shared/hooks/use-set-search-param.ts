import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useSetGetParam() {
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (value: string, paramName: string) => {
      const params = new URLSearchParams(window.location.search);

      if (value) {
        params.set(paramName, value);
      } else {
        params.delete(paramName);
      }

      const nextQuery = params.toString();
      const currentQuery = window.location.search.startsWith("?")
        ? window.location.search.slice(1)
        : window.location.search;

      if (nextQuery === currentQuery) {
        return;
      }

      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl);
    },
    [pathname, router],
  );
}
