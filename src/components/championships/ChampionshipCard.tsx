import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Edit, Plus, Eye, Trash2, Trophy } from "lucide-react";

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
    <Card className="hover:shadow-lg transition-all relative border-t-8 border-green-600 hover:bg-green-50 duration-300 ">
      {/* <div className="absolute top-0 left-0 right-0 h-1 bg-green-600 rounded-t-xl"></div> */}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{championship.name}</CardTitle>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{championship.year}</span>
          <div className="flex gap-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {championship.modality}
            </span>
            {championship.format && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {championship.format}
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-500">
          Criado em: {formatDate(championship.createdAt)}
        </span>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2 justify-center flex-wrap">
          <button
            type="button"
            className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800 px-2 py-1 rounded transition-colors hover:bg-yellow-50 text-xs"
            onClick={() => onEdit(championship)}
          >
            <Edit size={14} />
            <span>Editar</span>
          </button>
          {championship.format !== "Mata-Mata" && (
            <button
              type="button"
              className="flex items-center gap-1 text-green-600 hover:text-green-800 px-2 py-1 rounded transition-colors hover:bg-green-50 text-xs"
              onClick={() => onTeams(championship)}
            >
              <Plus size={14} />
              <span>Times</span>
            </button>
          )}
          {championship.format === "Mata-Mata" && onKnockout && (
            <button
              type="button"
              className="flex items-center gap-1 text-purple-600 hover:text-purple-800 px-2 py-1 rounded transition-colors hover:bg-purple-50 text-xs"
              onClick={() => onKnockout(championship)}
            >
              <Trophy size={14} />
              <span>Confrontos mata-mata</span>
            </button>
          )}
          <button
            type="button"
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 px-2 py-1 rounded transition-colors hover:bg-blue-50 text-xs"
            onClick={() =>
              (window.location.href = `/dashboard/championships/${championship.id}/matches`)
            }
          >
            <Eye size={14} />
            <span>Partidas</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1 text-red-600 hover:text-red-800 px-2 py-1 rounded transition-colors hover:bg-red-50 text-xs"
            onClick={() => onDelete(championship)}
          >
            <Trash2 size={14} />
            <span>Excluir</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
