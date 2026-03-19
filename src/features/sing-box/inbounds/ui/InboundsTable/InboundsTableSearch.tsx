import { useEffect, useState } from "react";

import { useDebounceValue } from "@/shared/hooks";
import { Input } from "@/shared/ui";

interface InboundsTableSearchProps {
  onSearch: (query: string) => void;
}

export function InboundsTableSearch({ onSearch }: InboundsTableSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounceValue(searchQuery, 300);

  useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  return (
    <Input
      className="max-w-100"
      placeholder="Поиск"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
}
