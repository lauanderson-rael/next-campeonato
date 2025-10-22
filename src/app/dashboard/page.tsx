import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import DashboardCard from "@/components/dashboard/DashboardCard";

export interface User {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default async function Dashboard() {
  const session: User | null = await getServerSession();

  // Permite visualizar o dashboard em desenvolvimento sem login
  const devBypass =
    process.env.NEXT_PUBLIC_DEV_DASHBOARD === "1" &&
    process.env.NODE_ENV === "development";

  if (!session && !devBypass) {
    return redirect("/");
  }

  const cards = [
    { title: "Jogadores", icon: "👥", href: "/dashboard/jogadores" },
    { title: "Times", icon: "🛡️", href: "/dashboard/times" },
    { title: "Campeonatos", icon: "🏆", href: "/dashboard/campeonatos" },
    { title: "Partidas", icon: "📋", href: "/dashboard/partidas" },
    { title: "Classificação", icon: "🏅", href: "/dashboard/classificacao" },
    { title: "Relatórios", icon: "📊", href: "/dashboard/relatorios" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Principal</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <DashboardCard 
                key={card.title} 
                title={card.title} 
                icon={<span>{card.icon}</span>}
                href={card.href}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
