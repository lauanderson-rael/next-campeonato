"use client";
import {
  Calendar,
  Home,
  Newspaper,
  ChartNoAxesColumn,
  School2,
  Shield,
  Users,
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
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { usePathname } from "next/navigation"; // Next.js 13+
import { useSidebar } from "@/components/ui/sidebar";

// Menu items.
const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Jogadores", url: "/dashboard/players", icon: Users },
  { title: "Times", url: "/dashboard/teams", icon: Shield },
  { title: "Classes", url: "/dashboard/class", icon: School2 },
  { title: "Partidas", url: "#", icon: Calendar },
  {
    title: "Classificação",
    url: "/dashboard/ranking",
    icon: ChartNoAxesColumn,
  },
  { title: "Relatórios", url: "#", icon: Newspaper },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar side="left" collapsible="icon">
      <SidebarTrigger className="ml-2 mt-1 text-gray-800 hidden md:flex hover:text-gray-950" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    {open ? (
                      // Sidebar aberta: mostrar ícone + nome
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={isActive ? "border-1 border-green-700" : ""}
                      >
                        <a href={item.url}>
                          <item.icon className="text-green-700 hover:text-green-800" />
                          <span className="ml-2">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    ) : (
                      // Sidebar colapsada: mostrar só ícone,  +  nome no Tooltip
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              className={
                                isActive ? "border-1 border-green-700" : ""
                              }
                            >
                              <a href={item.url}>
                                <item.icon className="text-green-700 hover:text-green-800" />
                                <span className="ml-2">{item.title}</span>
                              </a>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {item.title}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
