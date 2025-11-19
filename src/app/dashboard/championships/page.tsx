"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { ChampionshipCard } from "@/components/championships/ChampionshipCard";
import { ChampionshipForm } from "@/components/championships/ChampionshipForm";
import { TeamsModal } from "@/components/championships/TeamsModal";
import { Pagination } from "@/components/championships/Pagination";
import { SearchInput } from "@/components/search-input";
import { toast } from "react-toastify";

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
  const [searchTerm, setSearchTerm] = useState("");

  // Edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [championshipToEdit, setChampionshipToEdit] =
    useState<Championship | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    year: "",
    modality: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal de times
  const [teamsModalOpen, setTeamsModalOpen] = useState(false);
  const [selectedChampionship, setSelectedChampionship] =
    useState<Championship | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [championshipToDelete, setChampionshipToDelete] =
    useState<Championship | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Paginação e busca
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const championshipsArray = Array.isArray(championships) ? championships : [];
  const filteredChampionships = championshipsArray.filter(
    (championship) =>
      championship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      championship.modality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      championship.year.toString().includes(searchTerm)
  );
  const totalPages = Math.ceil(filteredChampionships.length / itemsPerPage);
  const paginatedChampionships = filteredChampionships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchChampionships = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/championships`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
        toast.success("Campeonato adicionado com sucesso!");
      } else {
        toast.error("Erro ao cadastrar campeonato");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
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
      toast.success("Campeonato excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir campeonato");
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
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
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
        toast.success("Campeonato editado com sucesso!");
      } else {
        toast.error("Erro ao atualizar campeonato");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
      console.error("Erro ao atualizar campeonato:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateMatches = async () => {
    if (!selectedChampionship || selectedTeams.length < 2) {
      toast.error("Selecione pelo menos 2 times");
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
        toast.success(
          `${result.data.matchesCreated} partidas geradas com sucesso!`
        );
        window.location.href = `/dashboard/championships/${selectedChampionship.id}/matches`;
      } else {
        toast.error("Erro ao gerar partidas");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
      console.error("Erro ao gerar partidas:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-4 md:px-6">
      <h1 className="w-full text-2xl font-bold mb-4 text-center">
        Campeonatos
      </h1>
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex justify-between items-center flex-row">
          <SearchInput
            placeholder="Buscar campeonatos..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <Button
            className="bg-green-700 hover:bg-green-800"
            onClick={() => setModalOpen(true)}
          >
            + Adicionar
          </Button>
        </CardHeader>

        <CardContent className="max-h-[60dvh] overflow-y-auto">
          {isLoading ? (
            <p>Carregando campeonatos...</p>
          ) : (
            <>
              {paginatedChampionships.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Nenhum campeonato cadastrado ainda.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedChampionships.map((championship) => (
                    <ChampionshipCard
                      key={championship.id}
                      championship={championship}
                      onEdit={handleEditClick}
                      onTeams={handleTeamsClick}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              )}
              <div className="text-center text-sm text-gray-600 mt-4">
                {searchTerm ? (
                  <>
                    Encontrados: {filteredChampionships.length} de{" "}
                    {championshipsArray.length} campeonatos
                  </>
                ) : (
                  <>Campeonatos cadastrados: {championshipsArray.length}</>
                )}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
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

      <ChampionshipForm
        open={modalOpen}
        onOpenChange={setModalOpen}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        isLoading={isSaving}
        title="Cadastrar Novo Campeonato"
        submitText="Cadastrar"
      />

      <ChampionshipForm
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        formData={editFormData}
        onFormChange={(field, value) =>
          setEditFormData({ ...editFormData, [field]: value })
        }
        onSubmit={handleEditSubmit}
        isLoading={isUpdating}
        title="Editar Campeonato"
        submitText="Atualizar"
      />

      <TeamsModal
        open={teamsModalOpen}
        onOpenChange={setTeamsModalOpen}
        championship={selectedChampionship}
        teams={teams}
        selectedTeams={selectedTeams}
        onTeamToggle={handleTeamToggle}
        onGenerateMatches={handleGenerateMatches}
        isGenerating={isGenerating}
      />
    </main>
  );
}
