import LoginButton from "./loginButton";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col px-2 justify-center items-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/20 animate-in fade-in duration-700">
      <Card className="w-full max-w-md p-8 shadow-xl border border-border bg-card/80 backdrop-blur-md flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo-if.png"
            alt="Logo IFMA"
            width={64}
            height={64}
            className="mb-2 drop-shadow-lg"
          />
          <h1 className="text-center text-3xl font-bold text-primary mb-1 tracking-tight">
            Sistema de Campeonatos
          </h1>
          <p className="text-muted-foreground text-center text-base">
            Gerencie campeonatos de forma simples, rápida e segura.
          </p>
        </div>
        <div className="w-full flex flex-col items-center mt-4">
          <LoginButton />
        </div>
      </Card>
      <footer className="mt-8 text-xs text-muted-foreground opacity-80">
        © {new Date().getFullYear()} IFMA - Todos os direitos reservados.
      </footer>
    </div>
  );
}
