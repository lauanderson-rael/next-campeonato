import Link from "next/link";

export default function Topbar() {
  return (
    <header className="w-full bg-green-600 text-white flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🏆</span>
        <span className="font-semibold text-lg">Campeonato Escolar</span>
      </div>
      <div>
        <Link
          href="/"
          className="bg-white text-green-600 px-4 py-1 rounded-md font-medium"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
