"use client";
import DashboardCard from "@/components/DashboardCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useVerifyUserLogged } from "@/hooks/useVerifyUserLogged";
import {
  Users,
  Shield,
  Trophy,
  ClipboardList,
  Medal,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useVerifyUserLogged();

  // SKELETON
  if (loading) {
    return (
      <div>
        <main className="flex-1 p-4 md:px-12">
          {/* Skeleton do título */}
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          {/* Skeleton da descrição */}
          <Skeleton className="h-5 w-96 mx-auto mb-6" />

          {/* Skeleton dos cards */}
          <div className="md:flex md:justify-center ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:max-w-4xl">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  const cards = [
    {
      title: "Jogadores",
      description:
        "Gerencie informações e cadastros dos atletas participantes.",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      href: "/dashboard/players",
    },
    {
      title: "Times",
      description: "Crie e edite as equipes inscritas nas competições.",
      icon: <Shield className="w-6 h-6 text-green-600" />,
      href: "/dashboard/teams",
    },
    {
      title: "Campeonatos",
      description:
        "Administre os torneios e eventos realizados pela instituição.",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      href: "/dashboard/championships",
    },
    {
      title: "Partidas",
      description: "Organize os jogos, datas, horários e locais das partidas.",
      icon: <ClipboardList className="w-6 h-6 text-purple-600" />,
      href: "/dashboard/matches",
    },
    {
      title: "Classificação",
      description: "Acompanhe resultados e posições dos times na tabela.",
      icon: <Medal className="w-6 h-6 text-orange-500" />,
      href: "/dashboard/ranking",
    },
    {
      title: "Relatórios",
      description:
        "Visualize estatísticas e relatórios detalhados das competições.",
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      href: "/dashboard/reports",
    },
  ];

  return (
    <div>
      <main className="flex-1 p-4 md:px-12 ">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Dashboard Principal
        </h1>
        <p className="text-gray-600 mb-6 text-sm md:text-lg text-center">
          Sistema de gestão esportiva — controle total do seu campeonato.
        </p>

        <div className="md:flex md:justify-center ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:max-w-4xl">
            {cards.map((c) => (
              <DashboardCard
                key={c.title}
                title={c.title}
                description={c.description}
                icon={c.icon}
                href={c.href || "/"}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
