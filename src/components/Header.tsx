"use client";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import { Menu, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { setOpenMobile } = useSidebar();
  const { user } = useAuth();
  const router = useRouter();

  const formatName = (fullName: string) => {
    const names = fullName.trim().split(" ");
    if (names.length === 1) return names[0];
    return `${names[0]} ${names[names.length - 1]}`;
  };

  return (
    <div className="flex justify-between items-center px-4 py-4 bg-green-700 shadow-lg sticky top-0">
      <div className="flex items-center gap-3">
        {/* Botão para abrir Sidebar só aparece no mobile */}
        <button
          onClick={() => setOpenMobile(true)}
          className="md:hidden text-white hover:text-green-300"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
        {/* Logo ifma esconde so no mobile */}
        <Image
          src="/logo_white.png"
          alt="Logo IFMA"
          width={36}
          height={36}
          className="shadow-md hidden md:flex ml-2"
        />
        <h1 className="text-md md:text-2xl font-bold text-white tracking-tight">
          Sistema de Campeonatos
        </h1>
      </div>

      {/* Nome do usuário com ícone */}
      <button 
        onClick={() => router.push('/dashboard/profile')}
        className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer"
      >
        <User size={18} className="text-white" />
        <span className="text-white font-medium text-sm md:text-base">
          {user?.name ? formatName(user.name) : "Usuário"}
        </span>
      </button>
    </div>
  );
}
