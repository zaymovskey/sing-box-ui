"use client";
import { DoorOpen, FileCog, UserRound } from "lucide-react";
import Link from "next/link";

import { LogoutDialog } from "@/features/auth";
import { appRoutes } from "@/shared/lib";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui";

const items = [
  {
    title: "SB Конфиг",
    url: appRoutes.sbConfig,
    icon: FileCog,
  },
  {
    title: "Инбаунды",
    url: appRoutes.inbounds,
    icon: UserRound,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <LogoutDialog
                  renderTrigger={({ disabled }) => (
                    <SidebarMenuButton asChild>
                      <button
                        type="button"
                        disabled={disabled}
                        className="cursor-pointer"
                      >
                        <DoorOpen className="size-4" />
                        <span>Выход</span>
                      </button>
                    </SidebarMenuButton>
                  )}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
