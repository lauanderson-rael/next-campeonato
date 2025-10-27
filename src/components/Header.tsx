"use client";
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
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <div className="flex justify-between items-center px-4 py-4 bg-green-600 shadow-lg">
      <div className="flex items-center gap-3">
        <Image
          src="/logo_white.png"
          alt="Logo IFMA"
          width={48}
          height={48}
          className="drop-shadow-md"
        />
        <h1 className="text-2xl font-bold text-white tracking-tight">
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
              onClick={() => signOut()}
              className="bg-green-600 hover:bg-green-700"
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
