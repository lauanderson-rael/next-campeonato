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
  Trophy,
  Menu,
  X,
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

import { Button } from "@/components/ui/button";
import ModalLogout from "./ModalLogout";

// Menu items.
const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Jogadores", url: "/dashboard/players", icon: Users },
  { title: "Times", url: "/dashboard/teams", icon: Shield },
  { title: "Turmas", url: "/dashboard/class", icon: School2 },
  { title: "Partidas", url: "/dashboard/matches", icon: Calendar },
  { title: "Campeonatos", url: "/dashboard/championships", icon: Trophy },
  {
    title: "Classificação",
    url: "/dashboard/ranking",
    icon: ChartNoAxesColumn,
  },
  { title: "Relatórios", url: "/dashboard/reports", icon: Newspaper },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar
      side="left"
      collapsible="icon"
      variant="sidebar"
      className="ml-2 z-20"
    >
      {/* <SidebarTrigger className="ml-2 mt-1 text-gray-800 hidden md:flex hover:text-gray-950"   /> */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="ml-2 mt-2 text-gray-800 hidden md:flex hover:text-gray-950 hover:bg-gray-100"
      >
        {open ? <X /> : <Menu />}
      </Button>
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
                        className={
                          isActive
                            ? "!bg-green-100 shadow-md shadow-green-700/20 "
                            : ""
                        }
                      >
                        <a href={item.url}>
                          <item.icon className="text-green-700 hover:text-green-800" />
                          <span
                            className={
                              isActive ? "ml-2 text-green-700" : "ml-2"
                            }
                          >
                            {item.title}
                          </span>
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
                                isActive
                                  ? "!bg-green-100 shadow-md shadow-green-700/20"
                                  : ""
                              }
                            >
                              <a href={item.url}>
                                <item.icon className=" text-green-700 hover:text-green-800" />
                                <span className="ml-1">{item.title}</span>
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
                  <a href="/dashboard/profile">
                    <span>Perfil</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Info className="mr-2 text-green-700 hover:text-green-800" />
                  <a href="/dashboard/help">
                    <span>Ajuda</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <LogOut className="mr-2 text-green-700 hover:text-green-800" />
                  {/* <span>Sair do sistema</span> */}
                  <ModalLogout />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
