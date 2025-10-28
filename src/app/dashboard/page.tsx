import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import DashboardCard from "@/components/DashboardCard";

// Importa os ícones da lucide-react
import {
  Users,
  Shield,
  Trophy,
  ClipboardList,
  Medal,
  BarChart3,
} from "lucide-react";

export interface User {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default async function Dashboard() {
  const session: User | null = await getServerSession();

  // Permite visualizar o dashboard sem autenticação no modo dev
  const devBypass =
    process.env.NEXT_PUBLIC_DEV_DASHBOARD === "1" &&
    process.env.NODE_ENV === "development";

  if (!session && !devBypass) {
    return redirect("/");
  }

  const cards = [
    {
      title: "Jogadores",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      href: "/dashboard/players",
    },
    {
      title: "Times",
      icon: <Shield className="w-6 h-6 text-green-600" />,
      href: "/dashboard/teams",
    },
    {
      title: "Campeonatos",
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      href: "/dashboard/tournaments",
    },
    {
      title: "Partidas",
      icon: <ClipboardList className="w-6 h-6 text-purple-600" />,
      href: "/dashboard/matches",
    },
    {
      title: "Classificação",
      icon: <Medal className="w-6 h-6 text-orange-500" />,
      href: "/dashboard/ranking",
    },
    {
      title: "Relatórios",
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      href: "/dashboard/reports",
    },
  ];

  return (
    <div>
      <main className="flex-1 p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
          Dashboard Principal
        </h1>
        <p className="text-gray-600 mb-6 text-sm md:text-lg  text-center md:text-left">
          Sistema de gestão esportiva — controle total do seu campeonato.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {cards.map((c) => (
            <DashboardCard
              key={c.title}
              title={c.title}
              icon={c.icon}
              href={c.href || "/"}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
