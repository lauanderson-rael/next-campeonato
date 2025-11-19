"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Trash2, Eye, Plus, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

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
  teams?: Team[];
  createdAt?: string;
  updatedAt?: string;
}

export default function ChampionshipsPage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    modality: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [championshipToEdit, setChampionshipToEdit] = useState<Championship | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    year: "",
    modality: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal de times
  const [teamsModalOpen, setTeamsModalOpen] = useState(false);
  const [selectedChampionship, setSelectedChampionship] = useState<Championship | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [championshipToDelete, setChampionshipToDelete] = useState<Championship | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const championshipsArray = Array.isArray(championships) ? championships : [];
  const totalPages = Math.ceil(championshipsArray.length / itemsPerPage);
  const paginatedChampionships = championshipsArray.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function formatDate(date?: string | null) {
    if (!date) return <span className="text-gray-400">–</span>;
    const d = new Date(date);
    if (isNaN(d.getTime())) return <span className="text-gray-400">–</span>;
    return d.toLocaleDateString("pt-BR");
  }

  const fetchChampionships = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/championships`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      // Garantir que sempre seja um array
      setChampionships(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar campeonatos:", error);
      setChampionships([]); // Garantir que seja array vazio em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      console.error("Erro ao buscar times:", error);
    }
  };

  useEffect(() => {
    fetchChampionships();
    fetchTeams();
  }, []);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/championships`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            year: Number(formData.year),
            modality: formData.modality,
          }),
        }
      );
      if (response.ok) {
        setFormData({ name: "", year: "", modality: "" });
        setModalOpen(false);
        await fetchChampionships();
      } else {
        alert("Erro ao cadastrar campeonato");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
      console.error("Erro ao cadastrar campeonato:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (championship: Championship) => {
    setChampionshipToDelete(championship);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!championshipToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/championships/${championshipToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchChampionships();
      setDeleteDialogOpen(false);
      setChampionshipToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir campeonato:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTeamsClick = (championship: Championship) => {
    setSelectedChampionship(championship);
    setSelectedTeams([]);
    setTeamsModalOpen(true);
  };

  const handleTeamToggle = (teamId: number) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleEditClick = (championship: Championship) => {
    setChampionshipToEdit(championship);
    setEditFormData({
      name: championship.name,
      year: String(championship.year),
      modality: championship.modality,
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!championshipToEdit) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/championships/${championshipToEdit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editFormData.name,
            year: Number(editFormData.year),
            modality: editFormData.modality,
          }),
        }
      );
      if (response.ok) {
        setEditModalOpen(false);
        setChampionshipToEdit(null);
        await fetchChampionships();
      } else {
        alert("Erro ao atualizar campeonato");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
      console.error("Erro ao atualizar campeonato:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateMatches = async () => {
    if (!selectedChampionship || selectedTeams.length < 2) {
      alert("Selecione pelo menos 2 times");
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/championships/${selectedChampionship.id}/generate-matches`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            teamIds: selectedTeams,
          }),
        }
      );
      
      if (response.ok) {
        const result = await response.json();
        setTeamsModalOpen(false);
        alert(`${result.data.matchesCreated} partidas geradas com sucesso!`);
        window.location.href = `/dashboard/championships/${selectedChampionship.id}/matches`;
      } else {
        alert("Erro ao gerar partidas");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
      console.error("Erro ao gerar partidas:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-4 md:px-6">
      <h1 className="w-full text-2xl font-bold mb-4 text-center">Campeonatos</h1>
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle>Listagem de Campeonatos</CardTitle>
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                + Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Campeonato</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Campeonato</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Copa Verde da Vida"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
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
                    onChange={(e) => handleFormChange("year", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidade</Label>
                  <select
                    id="modality"
                    value={formData.modality}
                    onChange={(e) => handleFormChange("modality", e.target.value)}
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
                    disabled={isSaving}
                  >
                    {isSaving ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="max-h-[60dvh] overflow-y-auto">
          {isLoading ? (
            <p>Carregando campeonatos...</p>
          ) : (
            <>
              <Table>
                <TableCaption>
                  Campeonatos cadastrados: {championshipsArray.length}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedChampionships.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-gray-500"
                      >
                        Nenhum campeonato cadastrado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedChampionships.map((championship) => (
                      <TableRow key={championship.id}>
                        <TableCell>{championship.name}</TableCell>
                        <TableCell>{championship.year}</TableCell>
                        <TableCell>{championship.modality}</TableCell>
                        <TableCell>{formatDate(championship.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              aria-label="Editar"
                              className="text-yellow-600 hover:text-yellow-800 p-2 rounded transition-colors"
                              onClick={() => handleEditClick(championship)}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              type="button"
                              aria-label="Adicionar times"
                              className="text-green-600 hover:text-green-800 p-2 rounded transition-colors"
                              onClick={() => handleTeamsClick(championship)}
                            >
                              <Plus size={18} />
                            </button>
                            <button
                              type="button"
                              aria-label="Ver partidas"
                              className="text-blue-600 hover:text-blue-800 p-2 rounded transition-colors"
                              onClick={() => window.location.href = `/dashboard/championships/${championship.id}/matches`}
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              type="button"
                              aria-label="Excluir"
                              className="text-red-600 hover:text-red-800 p-2 rounded transition-colors"
                              onClick={() => handleDeleteClick(championship)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {/* Paginação */}
              <div className="flex items-center justify-center gap-2 py-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ArrowLeft size={18} />
                </Button>
                <span className="px-2 text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ArrowRight size={18} />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja excluir o campeonato "${championshipToDelete?.name}"? Esta ação não pode ser desfeita.`}
        isDeleting={isDeleting}
      />

      {/* Modal de edição */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Campeonato</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do Campeonato</Label>
              <Input
                id="edit-name"
                placeholder="Ex: Copa Verde da Vida"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-year">Ano</Label>
              <Input
                id="edit-year"
                type="number"
                placeholder="Ex: 2025"
                value={editFormData.year}
                onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-modality">Modalidade</Label>
              <select
                id="edit-modality"
                value={editFormData.modality}
                onChange={(e) => setEditFormData({ ...editFormData, modality: e.target.value })}
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
                disabled={isUpdating}
              >
                {isUpdating ? "Atualizando..." : "Atualizar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de times */}
      <Dialog open={teamsModalOpen} onOpenChange={setTeamsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Times - {selectedChampionship?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-gray-600">Selecione os times que participarão do campeonato:</p>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {teams.map((team) => (
                <label key={team.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTeams.includes(team.id)}
                    onChange={() => handleTeamToggle(team.id)}
                    className="rounded"
                  />
                  <span>{team.name}</span>
                  <span className="text-sm text-gray-500">({team.modality})</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Times selecionados: {selectedTeams.length}
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={handleGenerateMatches}
              className="bg-green-700 hover:bg-green-800 w-full"
              disabled={isGenerating || selectedTeams.length < 2}
            >
              {isGenerating ? "Gerando..." : "Gerar Partidas"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}