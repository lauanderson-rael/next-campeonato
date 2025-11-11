"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/password-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage("Um link de recuperação foi enviado ao seu e-mail.");
      } else {
        setMessage(
          "Erro ao enviar o link. Verifique o e-mail e tente novamente."
        );
      }
    } catch (err) {
      setMessage("Ocorreu um erro inesperado.");
      console.error("Erro ao enviar o link de recuperação:", err);
    }
  };

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
            <h1 className="text-center text-3xl font-bold text-green-700 mb-1 tracking-tight">
              Recuperar senha
            </h1>
          </div>
          <CardDescription className="text-center">
            Digite o e-mail cadastrado para receber o link de redefinição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="email"
              required
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              type="submit"
              className="bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
            >
              Enviar link
            </button>
          </form>
          {message && (
            <p className="mt-2 text-center text-sm text-gray-600">{message}</p>
          )}
          <div className="text-center mt-4 text-sm">
            Lembrou sua senha?{" "}
            <Link href="/" className="text-green-600 hover:underline">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
