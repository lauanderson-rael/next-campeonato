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

import { useAuth } from "@/contexts/AuthContext";

export default function ModalLogout() {
  const { logout } = useAuth(); // Desestruture aqui

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className="cursor-pointer">Sair do sistema</span>
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
            onClick={logout}
            className="bg-green-700 hover:bg-green-800"
          >
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
