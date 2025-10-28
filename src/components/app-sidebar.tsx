import {
  Calendar,
  Home,
  Newspaper,
  ShieldHalf,
  ChartNoAxesColumn,
  UserRound,
  School2,
} from "lucide-react";

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
    icon: UserRound,
  },
  {
    title: "Times",
    url: "/dashboard/teams",
    icon: ShieldHalf,
  },
  {
    title: "Classes",
    url: "/dashboard/class",
    icon: School2,
  },
  {
    title: "Partidas",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Classificação",
    url: "dashboard/ranking",
    icon: ChartNoAxesColumn,
  },
  {
    title: "Relatórios",
    url: "#",
    icon: Newspaper,
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
                      <item.icon className="text-green-600 hover:text-green-800" />
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
