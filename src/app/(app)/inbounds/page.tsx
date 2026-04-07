import { type Metadata } from "next";

import { InboundsTableScreen } from "@/features/sing-box";

export const metadata: Metadata = {
  title: "Inboudns",
};

export default function InboundsPage() {
  return (
    <div>
      <InboundsTableScreen />
    </div>
  );
}
