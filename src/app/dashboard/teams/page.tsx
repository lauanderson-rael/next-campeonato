"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [name, setName] = useState("");
  const [modality, setModality] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any | null>(null);

  // Busca os times da API
  const fetchTeams = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`);
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      console.error("Erro ao buscar times:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Cadastrar ou editar time
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = editingTeam ? "PATCH" : "POST";
    const url = editingTeam
      ? `${process.env.NEXT_PUBLIC_API_URL}/teams/${editingTeam.id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/teams`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, modality }),
      });

      if (response.ok) {
        setName("");
        setModality("");
        setEditingTeam(null);
        setOpen(false);
        fetchTeams(); // Atualiza lista
      } else {
        alert("Erro ao salvar time");
      }
    } catch (error) {
      alert("Erro ao salvar time");
    } finally {
      setLoading(false);
    }
  };

  // Abre modal em modo de edição
  const handleEdit = (team: any) => {
    setEditingTeam(team);
    setName(team.name);
    setModality(team.modality);
    setOpen(true);
  };

  return (
    <div className="flex flex-col items-center p-4 md:p-6">
      <Card className="w-full max-w-2xl ">
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle>Times Cadastrados - {teams.length}</CardTitle>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-green-700 hover:bg-green-800"
                onClick={() => {
                  setEditingTeam(null);
                  setName("");
                  setModality("");
                }}
              >
                + Adicionar
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTeam ? "Editar Time" : "Cadastrar Novo Time"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Time</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidade</Label>
                  <select
                    id="modality"
                    value={modality}
                    onChange={(e) => setModality(e.target.value)}
                    required
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Selecione a modalidade</option>
                    <option value="Futebol">Futebol</option>
                    <option value="Vôlei">Vôlei</option>
                    <option value="Basquete">Basquete</option>
                  </select>
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-green-700 hover:bg-green-800 w-full"
                    disabled={loading}
                  >
                    {loading
                      ? "Salvando..."
                      : editingTeam
                      ? "Salvar Alterações"
                      : "Cadastrar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {fetching ? (
            <p>Carregando times...</p>
          ) : teams.length === 0 ? (
            <p className="text-gray-500">Nenhum time cadastrado ainda.</p>
          ) : (
            <ul className="space-y-2 max-h-[60dvh] overflow-auto">
              {teams.map((team) => (
                <li
                  key={team.id}
                  className="border rounded-lg p-3 flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{team.name}</p>
                    <p className="text-sm text-gray-600">({team.modality})</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(team)}
                    title="Editar"
                  >
                    <Pencil className="w-5 h-5 text-green-600 hover:text-green-700" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
