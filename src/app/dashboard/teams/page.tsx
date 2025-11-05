"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  createdAt?: string;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", modality: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: 0,
    name: "",
    modality: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(teams.length / itemsPerPage);
  const paginatedTeams = teams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function formatDate(date?: string | null) {
    if (!date) return <span className="text-gray-400">–</span>;
    const d = new Date(date);
    if (isNaN(d.getTime())) return <span className="text-gray-400">–</span>;
    return d.toLocaleDateString("pt-BR");
  }

  // Listagem
  const fetchTeams = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`);
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      console.error("Erro ao buscar times:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTeams();
  }, []);

  // Cadastro
  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ name: "", modality: "" });
        setModalOpen(false);
        await fetchTeams();
      } else {
        alert("Erro ao cadastrar time");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
      console.error("Erro ao cadastrar time:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Exclusão
  const handleDelete = async (team: Team) => {
    if (window.confirm(`Confirma exclusão de ${team.name}?`)) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${team.id}`, {
        method: "DELETE",
      });
      await fetchTeams();
    }
  };

  // Edição
  function handleEditOpen(team: Team) {
    setEditFormData({ id: team.id, name: team.name, modality: team.modality });
    setEditModalOpen(true);
  }
  function handleEditFormChange(field: string, value: string) {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  }
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsEditing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${editFormData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editFormData.name,
            modality: editFormData.modality,
          }),
        }
      );
      if (response.ok) {
        setEditModalOpen(false);
        await fetchTeams();
      } else {
        alert("Erro ao editar time!");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
      console.error("Erro ao editar time:", error);
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <main className="flex flex-col items-center p-4 md:px-6">
      <h1 className="w-full text-2xl font-bold mb-4 text-center ">Times</h1>
      <Card className="w-full max-w-4xl ">
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle>Listagem de Times</CardTitle>
          {/* Modal de cadastro */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-green-700 hover:bg-green-800"
                onClick={() => setFormData({ name: "", modality: "" })}
              >
                + Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Time</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Time</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidade</Label>
                  <select
                    id="modality"
                    value={formData.modality}
                    onChange={(e) =>
                      handleFormChange("modality", e.target.value)
                    }
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
                    disabled={isSaving}
                  >
                    {isSaving ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          {/* Modal de edição */}
          <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Time</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome do Time</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) =>
                      handleEditFormChange("name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-modality">Modalidade</Label>
                  <select
                    id="edit-modality"
                    value={editFormData.modality}
                    onChange={(e) =>
                      handleEditFormChange("modality", e.target.value)
                    }
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
                    disabled={isEditing}
                  >
                    {isEditing ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="max-h-[60dvh] overflow-y-auto">
          {isLoading ? (
            <p>Carregando times...</p>
          ) : (
            <>
              <Table>
                <TableCaption>Times cadastrados: {teams.length}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Modalidade</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTeams.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500"
                      >
                        Nenhum time cadastrado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>{team.name}</TableCell>
                        <TableCell>{team.modality}</TableCell>
                        <TableCell>{formatDate(team.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              aria-label="Editar"
                              className="text-green-700 hover:text-green-900 p-2 rounded transition-colors"
                              onClick={() => handleEditOpen(team)}
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              type="button"
                              aria-label="Excluir"
                              className="text-red-600 hover:text-red-800 p-2 rounded transition-colors"
                              onClick={() => handleDelete(team)}
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
                  ← Anterior
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
                  Próxima →
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
