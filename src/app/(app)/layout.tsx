import type { ReactNode } from "react";

import { AuthGate } from "@/features/auth";
import { SidebarInset, SidebarProvider } from "@/shared/ui";
import { AppSidebar } from "@/widgets/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="p-2">{children}</SidebarInset>
      </SidebarProvider>
    </AuthGate>
  );
}
