import type { ReactNode } from "react";

import { Sidebar } from "@/widgets/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh grid grid-cols-[240px_1fr]">
      <Sidebar />
      <main className="p-4">{children}</main>
    </div>
  );
}
