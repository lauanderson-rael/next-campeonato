"use client";
import { useSidebar } from "@/components/ui/sidebar"; // Adicione os imports necessários
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Menu } from "lucide-react"; // Ícone Menu/hamburger
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Header() {
  const { setOpenMobile } = useSidebar(); // Hook do estado da sidebar
  const logout = useAuth();

  return (
    <div className="flex justify-between items-center px-4 py-4 bg-green-700 shadow-lg sticky top-0">
      <div className=" flex items-center gap-3">
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
          className="drop-shadow-md hidden md:flex"
        />
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Sistema de Campeonatos
        </h1>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-100 text-red-00 hover:text-red-700 font-semibold border-none shadow-md"
          >
            Logout
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente sair da conta?</AlertDialogTitle>
            <AlertDialogDescription>
              Ao clicar em continuar você será deslogado da sua conta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => logout.logout()}
              className="bg-green-700 hover:bg-green-800"
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
