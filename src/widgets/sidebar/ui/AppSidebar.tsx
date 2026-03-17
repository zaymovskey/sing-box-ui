"use client";
import { DoorOpen, FileCog, PanelLeft, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutDialog } from "@/features/auth";
import { appRoutes } from "@/shared/lib";
import {
  Button,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui";

import { ThemeToggle } from "./ThemeToggle";

const items = [
  {
    title: "JSON Конфиг",
    url: appRoutes.config,
    icon: FileCog,
  },
  {
    title: "Инбаунды",
    url: appRoutes.inbounds,
    icon: UserRound,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div>
              <Button
                className="mr-1 mb-1 h-8 w-8"
                size="icon"
                variant="outline"
                onClick={toggleSidebar}
              >
                <PanelLeft />
              </Button>
              <ThemeToggle />
            </div>
            <Separator className="my-2" />

            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <Separator className="mt-2" />
                <LogoutDialog
                  renderTrigger={({ disabled }) => (
                    <SidebarMenuButton asChild>
                      <button
                        className="cursor-pointer"
                        disabled={disabled}
                        type="button"
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
