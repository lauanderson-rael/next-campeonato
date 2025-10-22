import Link from "next/link";

function Icon({ name }: { name: string }) {
  switch (name) {
    case "dashboard":
      return (
        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v6h8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "jogadores":
      return (
        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zM2 21c0-3 4-5 6-5s6 2 6 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "times":
      return (
        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "campeonatos":
      return (
        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M8 2h8l1 5H7l1-5zM5 9h14l-1 7a6 6 0 01-6 4 6 6 0 01-6-4L5 9z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "partidas":
      return (
        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 7h18M3 12h18M3 17h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "classificacao":
      return (
        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2v20M5 8h14M5 16h14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "relatorios":
      return (
        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 3v18h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 14v-4M12 14v-8M17 14v-2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar() {
  const items = [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/dashboard/jogadores", label: "Jogadores", icon: "jogadores" },
    { href: "/dashboard/times", label: "Times", icon: "times" },
    { href: "/dashboard/campeonatos", label: "Campeonatos", icon: "campeonatos" },
    { href: "/dashboard/partidas", label: "Partidas", icon: "partidas" },
    { href: "/dashboard/classificacao", label: "Classificação", icon: "classificacao" },
    { href: "/dashboard/relatorios", label: "Relatórios", icon: "relatorios" },
  ];

  return (
    <aside className="w-64 bg-white border-r h-full p-4">
      <h3 className="text-xs font-semibold text-muted-foreground mb-4">
        NAVEGAÇÃO PRINCIPAL
      </h3>
      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

