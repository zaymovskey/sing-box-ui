"use client";

import { useConfigTextQuery } from "../..";

export function SingBoxConfigScreen() {
  const { data } = useConfigTextQuery();

  console.log("Config Text Data:", data);

  return <div>SingBox Config Screen</div>;
}
