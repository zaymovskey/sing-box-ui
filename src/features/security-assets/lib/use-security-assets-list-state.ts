import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useDebounceValue, useUpdateQueryParams } from "@/shared/hooks";

export function useSecurityAssetsListState() {
  const searchParams = useSearchParams();

  const selectedTypes = useMemo(() => {
    return searchParams.get("types")?.split(",").filter(Boolean) ?? [];
  }, [searchParams]);

  const searchFromUrl = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const debouncedSearchQuery = useDebounceValue(searchQuery, 300);

  const activePage = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10) || 1,
  );

  const setGetParam = useUpdateQueryParams<"search" | "page" | "types">();

  useEffect(() => {
    setGetParam({
      search: debouncedSearchQuery,
      page: "1",
    });
  }, [debouncedSearchQuery, setGetParam]);

  return {
    selectedTypes,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    activePage,
    setGetParam,
  };
}
