import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

interface Team {
  id: number;
  name: string;
  modality: string;
}

interface Championship {
  id: number;
  name: string;
  modality: string;
}

interface PairState {
  homeTeamId: string;
  awayTeamId: string;
}

interface KnockoutPairsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  championship: Championship | null;
  teams: Team[];
  isSubmitting: boolean;
  onSubmit: (data: { round: number; pairs: { homeTeamId: number; awayTeamId: number }[] }) => void;
}

export function KnockoutPairsModal({
  open,
  onOpenChange,
  championship,
  teams,
  isSubmitting,
  onSubmit
}: KnockoutPairsModalProps) {
  const [pairs, setPairs] = useState<PairState[]>([{ homeTeamId: "", awayTeamId: "" }]);
  const [round, setRound] = useState("1");

  useEffect(() => {
    if (open) {
      setPairs([{ homeTeamId: "", awayTeamId: "" }]);
      setRound("1");
    }
  }, [open]);

  const availableTeams = useMemo(() => {
    if (!championship) return [];
    return teams.filter((team) => team.modality === championship.modality);
  }, [teams, championship]);

  const selectedTeamIds = useMemo(() => {
    return new Set(
      pairs.flatMap((pair) => [Number(pair.homeTeamId), Number(pair.awayTeamId)])
        .filter((teamId) => Number.isInteger(teamId) && teamId > 0)
    );
  }, [pairs]);

  const handlePairChange = (index: number, field: keyof PairState, value: string) => {
    setPairs((prev) =>
      prev.map((pair, pairIndex) =>
        pairIndex === index ? { ...pair, [field]: value } : pair
      )
    );
  };

  const handleAddPair = () => {
    setPairs((prev) => [...prev, { homeTeamId: "", awayTeamId: "" }]);
  };

  const handleRemovePair = (index: number) => {
    setPairs((prev) => prev.filter((_, pairIndex) => pairIndex !== index));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!championship) {
      toast.error("Selecione um campeonato válido");
      return;
    }

    const normalizedRound = Number(round);
    if (!Number.isInteger(normalizedRound) || normalizedRound < 1) {
      toast.error("A rodada deve ser um número inteiro >= 1");
      return;
    }

    const normalizedPairs = pairs.map((pair) => ({
      homeTeamId: Number(pair.homeTeamId),
      awayTeamId: Number(pair.awayTeamId)
    }));

    const invalidPair = normalizedPairs.find(
      (pair) =>
        !Number.isInteger(pair.homeTeamId) ||
        !Number.isInteger(pair.awayTeamId) ||
        pair.homeTeamId <= 0 ||
        pair.awayTeamId <= 0 ||
        pair.homeTeamId === pair.awayTeamId
    );

    if (invalidPair) {
      toast.error("Preencha todos os confrontos com times diferentes");
      return;
    }

    const teamIds = normalizedPairs.flatMap((pair) => [pair.homeTeamId, pair.awayTeamId]);
    if (new Set(teamIds).size !== teamIds.length) {
      toast.error("Um time não pode estar em mais de um confronto");
      return;
    }

    onSubmit({ round: normalizedRound, pairs: normalizedPairs });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Montar mata-mata</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="round">Rodada</Label>
            <Input
              id="round"
              type="number"
              min="1"
              value={round}
              onChange={(e) => setRound(e.target.value)}
              required
            />
          </div>

          {pairs.map((pair, index) => (
            <div key={`${index}`} className="rounded-md border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confronto {index + 1}</span>
                {pairs.length > 1 && (
                  <button
                    type="button"
                    className="text-xs text-red-600 hover:text-red-800"
                    onClick={() => handleRemovePair(index)}
                  >
                    Remover
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Time A</Label>
                  <select
                    value={pair.homeTeamId}
                    onChange={(e) => handlePairChange(index, "homeTeamId", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Selecione</option>
                    {availableTeams
                      .filter((team) => {
                        if (Number(pair.homeTeamId) === team.id) return true;
                        if (Number(pair.awayTeamId) === team.id) return true;
                        return !selectedTeamIds.has(team.id);
                      })
                      .map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Time B</Label>
                  <select
                    value={pair.awayTeamId}
                    onChange={(e) => handlePairChange(index, "awayTeamId", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Selecione</option>
                    {availableTeams
                      .filter((team) => {
                        if (Number(pair.awayTeamId) === team.id) return true;
                        if (Number(pair.homeTeamId) === team.id) return true;
                        return !selectedTeamIds.has(team.id);
                      })
                      .map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddPair}
          >
            + Adicionar confronto
          </Button>

          <DialogFooter>
            <Button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Gerando..." : "Gerar confrontos"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
