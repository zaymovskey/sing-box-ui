import { type Metadata } from "next";

import { SingBoxConfigScreen } from "@/features/sing-box";

export const metadata: Metadata = {
  title: "JSON Config",
};

export default function ConfigPage() {
  return <SingBoxConfigScreen />;
}
