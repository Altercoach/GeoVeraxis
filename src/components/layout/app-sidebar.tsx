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
  Shield,
  Map,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "@/hooks/use-admin";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/map", icon: Map, label: "Map" },
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

const adminNavItems = [
    { href: "/dashboard/admin", icon: Shield, label: "Admin Panel" },
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
        fill="url(#logo-gradient-sidebar)"
      />
      <path
        d="M50 15L84 32.5V67.5L50 85L16 67.5V32.5L50 15Z"
        className="fill-sidebar"
      />
      <path
        d="M50 25L75 37.5V62.5L50 75L25 62.5V37.5L50 25Z"
        fill="url(#logo-gradient-sidebar)"
      />
       <defs>
        <linearGradient id="logo-gradient-sidebar" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(var(--sidebar-primary))"/>
            <stop offset="1" stopColor="hsl(var(--secondary))"/>
        </linearGradient>
      </defs>
    </svg>
);

export function AppSidebar() {
  const pathname = usePathname();
  const { viewAs } = useAdmin();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold text-lg font-jakarta">GeoVeraxis</span>
        </Link>
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
        {viewAs === 'Superadmin' && (
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <hr className="border-sidebar-border my-2" />
                    </SidebarMenuItem>
                    {adminNavItems.map((item) => (
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
        )}
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
