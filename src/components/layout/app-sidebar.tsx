"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileCheck2,
  Languages,
  Users,
  Bot,
  GitBranch,
  Database,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  {
    href: "/dashboard/documents",
    icon: FileCheck2,
    label: "Document Verification",
  },
  { href: "/dashboard/translate", icon: Languages, label: "AI Translation" },
  { href: "/dashboard/chatbot", icon: Bot, label: "AI Chatbot" },
  { href: "/dashboard/users", icon: Users, label: "User Management" },
  { href: "/dashboard/workflows", icon: GitBranch, label: "Workflows" },
  { href: "/dashboard/blockchain", icon: Database, label: "Blockchain" },
];

const settingsItems = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const Logo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 100 100"
    className="text-primary"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 0L100 25V75L50 100L0 75V25L50 0Z"
      className="text-sidebar-primary"
      fill="currentColor"
    />
    <path
      d="M50 15L84 32.5V67.5L50 85L16 67.5V32.5L50 15Z"
      className="fill-sidebar"
    />
    <path
      d="M50 25L75 37.5V62.5L50 75L25 62.5V37.5L50 25Z"
      className="text-sidebar-primary"
      fill="currentColor"
    />
  </svg>
);

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold text-lg">GeoLegal Nexus</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: "right" }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {settingsItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: "right" }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}