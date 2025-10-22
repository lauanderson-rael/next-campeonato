import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Jogadores",
    url: "/dashboard/players",
    icon: Inbox,
  },
  {
    title: "Times",
    url: "/dashboard/teams",
    icon: Calendar,
  },
  {
    title: "Campeonatos",
    url: "/dashboard/class",
    icon: Search,
  },
  {
    title: "Partidas",
    url: "#",
    icon: Settings,
  },
  {
    title: "Classificação",
    url: "#",
    icon: Settings,
  },
  {
    title: "Relatórios",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="top-[84px]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
