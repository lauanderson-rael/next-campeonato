"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    // login padrão q depende do seu backend (banco de dados, validação, etc).
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      setError("Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  function loginGoogle() {
    signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            disabled={loading}
          />
        </div>
        {error && <span className="text-destructive text-sm">{error}</span>}
        <Button
          type="submit"
          size="lg"
          className="w-full font-semibold bg-green-600 hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <div className="flex flex-col gap-2 items-center">
        <Button
          onClick={loginGoogle}
          variant="outline"
          size="lg"
          className="w-full flex gap-3 items-center justify-center font-semibold text-base shadow-md hover:scale-[1.03] transition-transform duration-200"
        >
          <Image
            src="/g-icon.png"
            alt="Google Logo"
            width={28}
            height={28}
            className="drop-shadow"
          />
          <span className="tracking-tight">Login com Google</span>
        </Button>
        <div className="flex justify-between w-full mt-2 text-sm">
          <a href="/register" className="text-primary hover:underline">
            Criar conta
          </a>
          <a
            href="/forgot-password"
            className="text-muted-foreground hover:underline"
          >
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  );
}
