import type { ReactNode } from "react";

import { AuthGate } from "@/features/auth";
import { SidebarProvider } from "@/shared/ui";
import { AppSidebar } from "@/widgets/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <SidebarProvider>
        <div className="grid min-h-dvh grid-cols-[240px_1fr]">
          <AppSidebar />
          <main className="p-4">{children}</main>
        </div>
      </SidebarProvider>
    </AuthGate>
  );
}
