"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/search-input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Pencil, Trash2, Users } from "lucide-react";
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
import { toast } from "react-toastify";
import { useVerifyUserLogged } from "@/hooks/useVerifyUserLogged";

interface Team {
  id: number;
  name: string;
  modality: string;
  createdAt?: string;
}

interface Class {
  id: number;
  name: string;
}

interface Player {
  id: number;
  name: string;
  age: number;
  classId: number;
  teamId: number;
  class?: Class;
  createdAt?: string;
}

export default function TeamsPage() {
  useVerifyUserLogged();
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

  // Exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Listagem de Jogadores do Time
  const [playersModalOpen, setPlayersModalOpen] = useState(false);
  const [selectedTeamPlayers, setSelectedTeamPlayers] = useState<Player[]>([]);
  const [isPlayersLoading, setIsPlayersLoading] = useState(false);
  const [selectedTeamName, setSelectedTeamName] = useState("");

  // Busca
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar times por nome
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);
  const paginatedTeams = filteredTeams.slice(
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
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ name: "", modality: "" });
        setModalOpen(false);
        await fetchTeams();
        toast.success("Time adicionado com sucesso!");
      } else {
        toast.error("Erro ao cadastrar time");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
      console.error("Erro ao cadastrar time:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Exclusão
  const handleDeleteClick = (team: Team) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!teamToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${teamToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchTeams();
      setDeleteDialogOpen(false);
      setTeamToDelete(null);
      toast.success("Time excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir time");
      console.error("Erro ao excluir time:", error);
    } finally {
      setIsDeleting(false);
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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${editFormData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editFormData.name,
            modality: editFormData.modality,
          }),
        }
      );
      if (response.ok) {
        setEditModalOpen(false);
        await fetchTeams();
        toast.success("Time editado com sucesso!");
      } else {
        toast.error("Erro ao editar time!");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
      console.error("Erro ao editar time:", error);
    } finally {
      setIsEditing(false);
    }
  }

  // Visualizar Jogadores
  const handleViewPlayers = async (team: Team) => {
    setSelectedTeamName(team.name);
    setIsPlayersLoading(true);
    setPlayersModalOpen(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/players?teamId=${team.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      
      // Filtro no client-side para garantir que só apareçam jogadores do time
      // caso o backend não suporte o filtro por query string
      const filteredData = Array.isArray(data) 
        ? data.filter((p: Player) => p.teamId === team.id)
        : [];
        
      setSelectedTeamPlayers(filteredData);
    } catch (error) {
      console.error("Erro ao buscar jogadores do time:", error);
      toast.error("Erro ao carregar jogadores");
    } finally {
      setIsPlayersLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-4 md:px-6">
      <h1 className="w-full text-2xl font-bold mb-4 text-center ">Times</h1>
      <Card className="w-full max-w-4xl ">
        <CardHeader className="flex justify-between items-center flex-row">
          <SearchInput
            placeholder="Buscar time pelo nome..."
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            className="max-w-md"
          />
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
            <p className="text-center">Carregando times...</p>
          ) : (
            <>
              <Table>
                <TableCaption>
                  {searchTerm
                    ? `${filteredTeams.length} time(s) encontrado(s)`
                    : `Times cadastrados: ${teams.length}`}
                </TableCaption>
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
                              aria-label="Ver Jogadores"
                              title="Ver Jogadores"
                              className="text-blue-600 hover:text-blue-800 p-2 rounded transition-colors"
                              onClick={() => handleViewPlayers(team)}
                            >
                              <Users size={18} />
                            </button>
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
                              onClick={() => handleDeleteClick(team)}
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
        description={`Tem certeza que deseja excluir o time "${teamToDelete?.name}"? Esta ação não pode ser desfeita.`}
        isDeleting={isDeleting}
      />

      {/* Modal de Jogadores do Time */}
      <Dialog open={playersModalOpen} onOpenChange={setPlayersModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Jogadores do Time - {selectedTeamName} </DialogTitle>
            <span style={{ color: "gray" }}>Total: {selectedTeamPlayers.length}</span>
          </DialogHeader>
          <div className="mt-4">
            {isPlayersLoading ? (
              <p className="text-center py-8">Carregando jogadores...</p>
            ) : (
              <div className="max-h-[50dvh] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTeamPlayers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-gray-500 py-8"
                        >
                          Nenhum jogador cadastrado para este time.
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedTeamPlayers.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell className="font-medium">
                            {player.name}
                          </TableCell>
                          <TableCell>{player.age}</TableCell>
                          <TableCell>
                            {player.class?.name || "–"}
                          </TableCell>
                          <TableCell>{formatDate(player.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => setPlayersModalOpen(false)}
              className="w-full"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
