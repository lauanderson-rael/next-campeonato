import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
}

interface TeamsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  championship: Championship | null;
  teams: Team[];
  selectedTeams: number[];
  onTeamToggle: (teamId: number) => void;
  onGenerateMatches: () => void;
  isGenerating: boolean;
}

export function TeamsModal({
  open,
  onOpenChange,
  championship,
  teams,
  selectedTeams,
  onTeamToggle,
  onGenerateMatches,
  isGenerating
}: TeamsModalProps) {
  // Filtrar times pela mesma modalidade do campeonato
  const filteredTeams = teams.filter(team => team.modality === championship?.modality);

  return (
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Inscritos - {championship?.name}</DialogTitle>
    </DialogHeader>
    
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Participantes do {championship?.modality}
        </span>
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
          {selectedTeams.length} selecionados
        </span>
      </div>
      
      <div className="max-h-80 overflow-y-auto space-y-2 border rounded p-3 bg-gray-50">
        {filteredTeams.length === 0 ? (
          <p className="text-center py-8 text-gray-500 text-sm">
            Nenhum time de {championship?.modality} encontrado.
          </p>
        ) : (
          filteredTeams.map((team) => (
            <label
              key={team.id}
              className={`flex items-center justify-between p-3 rounded border cursor-pointer ${
                selectedTeams.includes(team.id)
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-green-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(team.id)}
                  onChange={() => onTeamToggle(team.id)}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <div>
                  <div className="font-medium text-sm">{team.name}</div>
                  <div className="text-xs text-gray-500">{team.modality}</div>
                </div>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
    
    <DialogFooter>
      <Button
        onClick={onGenerateMatches}
        className="bg-green-600 hover:bg-green-700 w-full"
        disabled={isGenerating || selectedTeams.length < 2}
      >
        {isGenerating ? "Processando..." : "Atualizar Participantes"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  );
}