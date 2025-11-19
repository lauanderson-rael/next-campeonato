"use client";

import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando informações do usuário...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <User size={32} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
            <p className="text-gray-600">Informações da sua conta</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <User size={20} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail size={20} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Shield size={20} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">Função</p>
                <p className="font-medium text-gray-800 capitalize">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar size={20} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-500">ID do Usuário</p>
                <p className="font-medium text-gray-800">#{user.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}