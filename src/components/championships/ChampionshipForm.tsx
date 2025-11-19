import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChampionshipFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    year: string;
    modality: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  title: string;
  submitText: string;
}

export function ChampionshipForm({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  isLoading,
  title,
  submitText
}: ChampionshipFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Campeonato</Label>
            <Input
              id="name"
              placeholder="Ex: Copa Verde da Vida"
              value={formData.name}
              onChange={(e) => onFormChange("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Ano</Label>
            <Input
              id="year"
              type="number"
              placeholder="Ex: 2025"
              value={formData.year}
              onChange={(e) => onFormChange("year", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modality">Modalidade</Label>
            <select
              id="modality"
              value={formData.modality}
              onChange={(e) => onFormChange("modality", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Selecione a modalidade</option>
              <option value="Futebol">Futebol</option>
              <option value="Vôlei">Vôlei</option>
            </select>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-green-700 hover:bg-green-800 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}