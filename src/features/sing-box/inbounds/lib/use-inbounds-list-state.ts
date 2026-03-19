import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useDebounceValue, useSetGetParam } from "@/shared/hooks";

export function useInboundsListState() {
  const searchParams = useSearchParams();

  const typesFromUrl =
    searchParams.get("types")?.split(",").filter(Boolean) ?? [];
  const [selectedTypes, setSelectedTypes] = useState<string[]>(typesFromUrl);

  const searchFromUrl = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const debouncedSearchQuery = useDebounceValue(searchQuery, 300);

  const activePage = Math.max(
    1,
    Number.parseInt(searchParams.get("page") || "1", 10) || 1,
  );

  const setGetParam = useSetGetParam();

  useEffect(() => {
    setGetParam(debouncedSearchQuery, "search");
    setGetParam("1", "page");
  }, [debouncedSearchQuery, setGetParam]);

  useEffect(() => {
    setGetParam(
      selectedTypes.length > 0 ? selectedTypes.join(",") : "",
      "types",
    );
    setGetParam("1", "page");
  }, [selectedTypes, setGetParam]);

  return {
    selectedTypes,
    setSelectedTypes,
    searchQuery,
    setSearchQuery,
    debouncedSearchQuery,
    activePage,
    setGetParam,
  };
}
