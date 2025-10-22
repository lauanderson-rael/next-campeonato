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
    <div className="flex justify-between items-center p-4 bg-gray-200">
      <div className="flex items-center gap-2">
        <Image src="/logo-if.png" alt="Logo IFMA" width={50} height={50} />
  <h1 className="text-xl font-bold text-green-700">Campeonatos</h1>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Logout</Button>
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
            <AlertDialogAction onClick={() => signOut()}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
