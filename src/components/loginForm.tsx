"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const router = useRouter();

  // Carregar Google Identity Services
  useEffect(() => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.warn('GOOGLE_CLIENT_ID não está definido.');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback
        });
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleGoogleCallback = async (response: any) => {
    try {
      setLoading(true);
      
      // Decodificar o JWT do Google
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      // Criar usuário no backend ou fazer login
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const result = await fetch(`${API_URL}/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleToken: response.credential,
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        }),
      });

      if (result.ok) {
        const data = await result.json();
        // Salvar token e usuário
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError('Erro ao fazer login com Google');
      }
    } catch (err) {
      setError('Erro ao processar login do Google');
    } finally {
      setLoading(false);
    }
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Email ou senha inválidos.");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function loginGoogle() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    console.log(clientId);
    console.log(!clientId);
    if (!clientId) {
      setError('Google OAuth não configurado.');
      return;
    }

    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google OAuth não carregado. Tente novamente.');
    }
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
          <a href="/register" className=" text-green-600 hover:underline">
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
