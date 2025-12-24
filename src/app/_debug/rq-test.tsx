"use client";

import { useQuery } from "@tanstack/react-query";

export function RqTest() {
  const q = useQuery({
    queryKey: ["rq-test"],
    queryFn: async () => {
      console.log("✅ React Query: queryFn called");
      return "✅ React Query works";
    },
  });

  if (q.isLoading) return <div>loading…</div>;
  if (q.isError) return <div>error</div>;

  return <div>{q.data}</div>;
}
