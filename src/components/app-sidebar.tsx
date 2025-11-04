"use client";
import {
  Calendar,
  Home,
  Newspaper,
  ChartNoAxesColumn,
  School2,
  Shield,
  Users,
  ChevronUp,
  User2,
  Settings,
  Info,
  LogOut,
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
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { usePathname } from "next/navigation"; // Next.js 13+
import { useSidebar } from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

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
    <Sidebar side="left" collapsible="icon" variant="sidebar" className="ml-3">
      <SidebarTrigger className="ml-2 mt-1 text-gray-800 hidden md:flex hover:text-gray-950" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    {open ? (
                      // Sidebar aberta: mostrar ícone + nome
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={isActive ? "border border-green-700" : ""}
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
                                isActive ? "border border-green-700" : ""
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Settings className="text-green-700 hover:text-green-800" />
                  <span className="ml-2">Configurações</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] ml-2"
              >
                <DropdownMenuItem>
                  <User2 className="mr-2 text-green-700 hover:text-green-800" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Info className="mr-2 text-green-700 hover:text-green-800" />
                  <a href="/dashboard/help">
                    <span>Ajuda</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 text-green-700 hover:text-green-800" />
                  <span>Sair do sistema</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
