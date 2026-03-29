"use client";

import { DoorOpen, FileCog, PanelLeft, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LogoutDialog } from "@/features/auth";
import { usePageTransitionAnimations } from "@/shared/hooks";
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
  {
    title: "TLS / Reality",
    url: appRoutes.securityAssets,
    icon: Shield,
  },
];

export function AppSidebar() {
  const { onClickLink } = usePageTransitionAnimations();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const [pendingPath, setPendingPath] = useState<string | null>(null);

  useEffect(() => {
    setPendingPath(null);
  }, [pathname]);

  const activePath = pendingPath ?? pathname;

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
                  <SidebarMenuButton
                    asChild
                    isActive={activePath === item.url}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.url === pathname) {
                        return;
                      }
                      setPendingPath(item.url);
                      onClickLink(item.url);
                    }}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <Separator className="my-2" />

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
