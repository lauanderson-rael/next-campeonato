"use client ";
import { Home, Search, ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Número 404 animado */}
        <div className="relative mb-8">
          <h1 className="text-[180px] font-bold text-green-200 leading-none select-none">
            404
          </h1>
        </div>

        {/* Mensagem principal */}
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Página não encontrada
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Ops! A página que você está procurando não existe ou foi movida para
          outro lugar.
        </p>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors font-medium"
          >
            <Home className="w-5 h-5" />
            Voltar ao Dashboard
          </a>
        </div>

        {/* Footer com código de erro */}
        <p className="mt-8 text-sm text-gray-500">
          Código de erro: 404 | Página não encontrada
        </p>
      </div>
    </div>
  );
}
