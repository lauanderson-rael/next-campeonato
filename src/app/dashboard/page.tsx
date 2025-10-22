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

  // Development bypass: set NEXT_PUBLIC_DEV_DASHBOARD=1 to view /dashboard without authentication
  const devBypass = process.env.NEXT_PUBLIC_DEV_DASHBOARD === "1" && process.env.NODE_ENV === "development";

  if (!session && !devBypass) {
    return redirect("/");
  }

  const cards = [
    { title: "Jogadores", icon: "👥" },
    { title: "Times", icon: "🛡️" },
    { title: "Campeonatos", icon: "🏆" },
    { title: "Partidas", icon: "📋" },
    { title: "Classificação", icon: "🏅" },
    { title: "Relatórios", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard Principal</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((c) => (
              <DashboardCard key={c.title} title={c.title} icon={<span>{c.icon}</span>} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
