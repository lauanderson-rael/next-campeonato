import { useAuth } from "@/contexts/AuthContext";

export function useApi() {
  const { token } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${API_URL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Adicionar token de autenticação se disponível
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Erro desconhecido" }));
      throw new Error(error.error || "Erro na requisição");
    }

    return response.json();
  };

  return { apiCall };
}
