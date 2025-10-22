import Image from "next/image";

export default function Topbar() {
  return (
    <header className="w-full bg-green-600 text-white flex items-center px-6 py-3 shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🏆</span>
        <span className="font-semibold text-lg">Campeonato Escolar</span>
      </div>
    </header>
  );
}
