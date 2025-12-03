"use client";
import { useState, useEffect } from "react";
import DashboardCard from "@/components/DashboardCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useVerifyUserLogged } from "@/hooks/useVerifyUserLogged";
import {
  Users,
  Shield,
  Trophy,
  ClipboardList,
  Medal,
  BarChart3,
  Calendar,
  Target,
} from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useVerifyUserLogged();
  const [stats, setStats] = useState({
    championships: 0,
    teams: 0,
    players: 0,
    matches: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const [champsRes, teamsRes, playersRes, matchesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/championships`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const champsData = await champsRes.json();
      const teamsData = await teamsRes.json();
      const playersData = await playersRes.json();
      const matchesData = await matchesRes.json();

      setStats({
        championships: Array.isArray(champsData) ? champsData.length : 0,
        teams: Array.isArray(teamsData) ? teamsData.length : 0,
        players: Array.isArray(playersData) ? playersData.length : 0,
        matches: Array.isArray(matchesData) ? matchesData.length : 0,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoadingStats(false);
    }
  };

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
        {/* Cards de Estatísticas */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
            {loadingStats ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))
            ) : (
              <>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-xs text-green-600 font-medium">
                        Campeonatos
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {stats.championships}
                      </p>
                    </div>
                    <Trophy className="text-green-600" size={32} />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-xs text-blue-600 font-medium">Times</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {stats.teams}
                      </p>
                    </div>
                    <Shield className="text-blue-600" size={32} />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-xs text-purple-600 font-medium">
                        Jogadores
                      </p>
                      <p className="text-2xl font-bold text-purple-700">
                        {stats.players}
                      </p>
                    </div>
                    <Users className="w-6 h-6  text-purple-700" size={32} />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-xs text-orange-600 font-medium">
                        Partidas
                      </p>
                      <p className="text-2xl font-bold text-orange-700">
                        {stats.matches}
                      </p>
                    </div>
                    <Calendar className="text-orange-600" size={32} />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

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
