import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh grid grid-cols-[240px_1fr]">
      <aside className="border-r p-4">Sidebar</aside>
      <main className="p-4">{children}</main>
    </div>
  );
}
