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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Adicionar Times - {championship?.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <p className="text-sm text-gray-600">
            Selecione os times que participarão do campeonato:
          </p>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {teams.map((team) => (
              <label
                key={team.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(team.id)}
                  onChange={() => onTeamToggle(team.id)}
                  className="rounded"
                />
                <span>{team.name}</span>
                <span className="text-sm text-gray-500">
                  ({team.modality})
                </span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Times selecionados: {selectedTeams.length}
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={onGenerateMatches}
            className="bg-green-700 hover:bg-green-800 w-full"
            disabled={isGenerating || selectedTeams.length < 2}
          >
            {isGenerating ? "Gerando..." : "Gerar Partidas"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}