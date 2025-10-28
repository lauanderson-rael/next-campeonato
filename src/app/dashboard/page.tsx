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

/*
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export interface User {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default async function Dashboard() {
  const session: User | null = await getServerSession();

  if (!session) {
    return redirect("/");
  }
  return (
    <div className="w-full h-screen">
    <div className="flex flex-col gap-4 p-2 ">
    <h2 className="text-2xl">Dashboard</h2>
    <p>Olá {session.user?.name}</p>
    <div>Email: {session.user?.email}</div>

        <img
          src={session.user?.image!}
          className="img-fluid rounded-top "
          width={150}
          height={150}
          alt=""
        />
      </div>
    </div>
  );
}

    */
