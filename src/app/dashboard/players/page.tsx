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
}
interface Player {
  id: number;
  name: string;
  age: number;
  classId: number;
  teamId: number;
  team?: Team;
  createdAt?: string;
}

export default function PlayersPage() {
  // Estados CRUD/Jogador
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    classId: "",
    teamId: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: 0,
    name: "",
    age: "",
    classId: "",
    teamId: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(players.length / itemsPerPage);
  const paginatedPlayers = players.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function formatDate(date?: string | null) {
    if (!date) return <span className="text-gray-400">–</span>;
    const d = new Date(date);
    if (isNaN(d.getTime())) return <span className="text-gray-400">–</span>;
    return d.toLocaleDateString("pt-BR");
  }

  // Buscar jogadores/times
  const fetchPlayers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`);
      const data = await res.json();
      setPlayers(data);
    } catch (error) {
      console.error("Erro ao buscar jogadores:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTeams = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`);
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      console.error("Erro ao buscar times:", error);
    }
  };
  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  // Cadastro
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/players`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            age: Number(formData.age),
            classId: Number(formData.classId),
            teamId: Number(formData.teamId),
          }),
        }
      );
      if (response.ok) {
        setFormData({ name: "", age: "", classId: "", teamId: "" });
        setModalOpen(false);
        await fetchPlayers();
      } else {
        alert("Erro ao cadastrar jogador");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setIsSaving(false);
    }
  };

  // Exclusão
  const handleDelete = async (player: Player) => {
    if (window.confirm(`Confirma exclusão de ${player.name}?`)) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players/${player.id}`, {
        method: "DELETE",
      });
      await fetchPlayers();
    }
  };

  // Edição
  function handleEditOpen(player: Player) {
    setEditFormData({
      id: player.id,
      name: player.name,
      age: String(player.age),
      classId: String(player.classId),
      teamId: String(player.teamId),
    });
    setEditModalOpen(true);
  }
  function handleEditFormChange(field: string, value: string) {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }
  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsEditing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/players/${editFormData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editFormData.name,
            age: Number(editFormData.age),
            classId: Number(editFormData.classId),
            teamId: Number(editFormData.teamId),
          }),
        }
      );
      if (response.ok) {
        setEditModalOpen(false);
        await fetchPlayers();
      } else {
        alert("Erro ao editar jogador!");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <main className="flex flex-col items-center p-4 md:p-6">
      <h1 className="w-full text-2xl font-bold mb-4 text-center ">Jogadores</h1>
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle>Listagem de Jogadores</CardTitle>
          {/* Modal de cadastro */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-700 hover:bg-green-800">
                + Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Jogador</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Jogador</Label>
                  <Input
                    id="name"
                    placeholder="Ex: João Silva"
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Ex: 20"
                    value={formData.age}
                    onChange={(e) => handleFormChange("age", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classId">ID da Turma</Label>
                  <Input
                    id="classId"
                    type="number"
                    placeholder="Ex: 1"
                    value={formData.classId}
                    onChange={(e) =>
                      handleFormChange("classId", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamId">Time</Label>
                  <select
                    id="teamId"
                    value={formData.teamId}
                    onChange={(e) => handleFormChange("teamId", e.target.value)}
                    required
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Selecione o time</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
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
                <DialogTitle>Editar Jogador</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome do Jogador</Label>
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
                  <Label htmlFor="edit-age">Idade</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={editFormData.age}
                    onChange={(e) =>
                      handleEditFormChange("age", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-classId">ID da Turma</Label>
                  <Input
                    id="edit-classId"
                    type="number"
                    value={editFormData.classId}
                    onChange={(e) =>
                      handleEditFormChange("classId", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-teamId">Time</Label>
                  <select
                    id="edit-teamId"
                    value={editFormData.teamId}
                    onChange={(e) =>
                      handleEditFormChange("teamId", e.target.value)
                    }
                    required
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    <option value="">Selecione o time</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
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
            <p>Carregando jogadores...</p>
          ) : (
            <>
              <Table>
                <TableCaption>
                  Jogadores cadastrados: {players.length}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>ID da Turma</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPlayers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500"
                      >
                        Nenhum jogador cadastrado ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPlayers.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.age}</TableCell>
                        <TableCell>{player.classId}</TableCell>
                        <TableCell>
                          {player.team?.name || player.teamId}
                        </TableCell>
                        <TableCell>{formatDate(player.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              aria-label="Editar"
                              className="text-green-700 hover:text-green-900 p-2 rounded transition-colors"
                              onClick={() => handleEditOpen(player)}
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              type="button"
                              aria-label="Excluir"
                              className="text-red-600 hover:text-red-800 p-2 rounded transition-colors"
                              onClick={() => handleDelete(player)}
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
