"use client";

import { LogoutButton } from "@/features/auth";

export function Sidebar() {
  return (
    <aside className="border-r p-4">
      <h1>Sidebar</h1>
      <LogoutButton />
    </aside>
  );
}
