import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/TobBar";
import DashboardCard from "@/components/DashboardCard";

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
  const devBypass =
    process.env.NEXT_PUBLIC_DEV_DASHBOARD === "1" &&
    process.env.NODE_ENV === "development";

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
    <div className=" bg-gray-50">
      <div className="flex">
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard Principal</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((c) => (
              <DashboardCard
                key={c.title}
                title={c.title}
                icon={<span>{c.icon}</span>}
              />
            ))}
          </div>
        </main>
      </div>
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
