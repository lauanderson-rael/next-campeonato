import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Edit, Plus, Eye, Trash2, Trophy, ChartNoAxesColumn } from "lucide-react";

interface Team {
  id: number;
  name: string;
  modality: string;
}

interface Championship {
  id: number;
  name: string;
  year: number;
  modality: string;
  format?: string;
  teams?: Team[];
  createdAt?: string;
  updatedAt?: string;
}

interface ChampionshipCardProps {
  championship: Championship;
  onEdit: (championship: Championship) => void;
  onTeams: (championship: Championship) => void;
  onKnockout?: (championship: Championship) => void;
  onDelete: (championship: Championship) => void;
}

function formatDate(date?: string | null) {
  if (!date) return <span className="text-gray-400">–</span>;
  const d = new Date(date);
  if (isNaN(d.getTime())) return <span className="text-gray-400">–</span>;
  return d.toLocaleDateString("pt-BR");
}

export function ChampionshipCard({
  championship,
  onEdit,
  onTeams,
  onKnockout,
  onDelete,
}: ChampionshipCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all relative border-t-12 border-green-600 hover:bg-green-50/50 duration-300 overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-green-700 transition-colors">
            {championship.name}
          </CardTitle>
          <span className="text-xs font-semibold text-gray-500">{championship.year}</span>
        </div>
        
        <div className="flex gap-2 mt-1">
          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
            {championship.modality}
          </span>
          {championship.format && (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              {championship.format}
            </span>
          )}
        </div>
        
        <div className="text-[14px] text-gray-400 mt-2">
          Criado em: {formatDate(championship.createdAt)}
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 px-2 py-2 rounded-md transition-all hover:bg-blue-600 text-xs font-medium"
            onClick={() =>
              (window.location.href = `/dashboard/championships/${championship.id}/matches`)
            }
          >
            <Eye size={14} />
            <span>Partidas</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 text-amber-600 hover:text-white border border-amber-200 hover:border-amber-600 px-2 py-2 rounded-md transition-all hover:bg-amber-600 text-xs font-medium"
            onClick={() =>
              (window.location.href = `/dashboard/ranking?championshipId=${championship.id}`)
            }
          >
            <ChartNoAxesColumn size={14} />
            <span>Ranking</span>
          </button>

          {championship.format !== "Mata-Mata" && (
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 px-2 py-2 rounded-md transition-all hover:bg-emerald-600 text-xs font-medium"
              onClick={() => onTeams(championship)}
            >
              <Plus size={14} />
              <span>Inscritos</span>
            </button>
          )}

          {championship.format === "Mata-Mata" && onKnockout && (
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 text-purple-600 hover:text-white border border-purple-200 hover:border-purple-600 px-2 py-2 rounded-md transition-all hover:bg-purple-600 text-xs font-medium"
              onClick={() => onKnockout(championship)}
            >
              <Trophy size={14} />
              <span>Chaveamento</span>
            </button>
          )}

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 text-gray-600 hover:text-white border border-gray-200 hover:border-gray-600 px-2 py-2 rounded-md transition-all hover:bg-gray-600 text-xs font-medium"
            onClick={() => onEdit(championship)}
          >
            <Edit size={14} />
            <span>Editar</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 text-red-600 hover:text-white border border-red-100 hover:border-red-600 px-2 py-2 rounded-md transition-all hover:bg-red-600 text-xs font-medium col-span-2 mt-1"
            onClick={() => onDelete(championship)}
          >
            <Trash2 size={14} />
            <span>Excluir Campeonato</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
