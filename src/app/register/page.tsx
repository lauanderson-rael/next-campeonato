"use client";
import Image from "next/image";
import Link from "next/link";
import { RegisterForm } from "@/components/registerForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="flex px-4 h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md px-2 py-8 shadow-xl">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/logo-if.png"
              alt="Logo IFMA"
              width={64}
              height={64}
              className="mb-2 drop-shadow-lg"
            />
            <h1 className="text-center text-4xl font-bold text-green-700 mb-1 tracking-tight">
              IFMA - Campeonatos
            </h1>
          </div>

          <h1 className="text-center text-xl font-bold  mb-1 tracking-tight">
            Criar Conta
          </h1>
          <CardDescription className="text-center">
            Preencha os dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="text-center mt-4 text-sm">
            Já possui conta?{" "}
            <Link href="/" className="text-green-600 hover:underline">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
