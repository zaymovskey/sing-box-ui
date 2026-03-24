import type { ReactNode } from "react";

import { AuthGate } from "@/features/auth";
import { SidebarInset, SidebarProvider } from "@/shared/ui";
import { Header } from "@/widgets/header";
import { AppSidebar } from "@/widgets/sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <SidebarProvider defaultOpen>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <main className="p-2">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </SidebarProvider>
    </AuthGate>
  );
}
