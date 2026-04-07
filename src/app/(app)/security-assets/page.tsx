import { type Metadata } from "next";

import { SecurityAssetsTableScreen } from "@/features/security-assets";

export const metadata: Metadata = {
  title: "Security Assets",
};

export default function SecurityAssetsPage() {
  return (
    <div>
      <SecurityAssetsTableScreen />
    </div>
  );
}
