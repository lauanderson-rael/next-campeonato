"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/components/search-input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Pencil, Trash2 } from "lucide-react";
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

interface Class {
  id: number;
  name: string;
  year: number;
  semester: string;
  course: string;
  maxStudents: number;
  createdAt?: string;
}

export default function ClassesPage() {
  useVerifyUserLogged();
  // Listagem e CRUD
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    semester: "",
    course: "",
    maxStudents: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Edição
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: 0,
    name: "",
    year: "",
    semester: "",
    course: "",
    maxStudents: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Exclusão
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Busca
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar turmas por nome
  const filteredClasses = classes.filter((cls) =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
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
  const fetchClasses = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Erro ao buscar classes:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchClasses();
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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            year: Number(formData.year),
            maxStudents: Number(formData.maxStudents),
          }),
        }
      );
      if (response.ok) {
        setFormData({
          name: "",
          year: "",
          semester: "",
          course: "",
          maxStudents: "",
        });
        setModalOpen(false);
        await fetchClasses();
        toast.success("Turma adicionada com sucesso!");
      } else {
        toast.error("Erro ao cadastrar turma");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
      console.error("Erro ao cadastrar classe:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Exclusão
  const handleDeleteClick = (cls: Class) => {
    setClassToDelete(cls);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!classToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/${classToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchClasses();
      setDeleteDialogOpen(false);
      setClassToDelete(null);
      toast.success("Turma excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir turma");
      console.error("Erro ao excluir turma:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Abrir o modal de edição
  function handleEditOpen(cls: Class) {
    setEditFormData({
      id: cls.id,
      name: cls.name,
      year: String(cls.year),
      semester: String(cls.semester),
      course: cls.course,
      maxStudents: String(cls.maxStudents),
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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/${editFormData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editFormData.name,
            year: Number(editFormData.year),
            semester: editFormData.semester,
            course: editFormData.course,
            maxStudents: Number(editFormData.maxStudents),
          }),
        }
      );
      if (response.ok) {
        setEditModalOpen(false);
        await fetchClasses();
        toast.success("Turma editada com sucesso!");
      } else {
        toast.error("Erro ao editar turma!");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
      console.error("Erro ao editar turma:", error);
    } finally {
      setIsEditing(false);
    }
  }

  return (
    <main className="flex flex-col items-center p-4 md:px-6">
      <h1 className="w-full text-2xl font-bold mb-4 text-center">Turmas</h1>
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex justify-between items-center flex-row">
          <SearchInput
            placeholder="Buscar turma pelo nome..."
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
              <Button className="bg-green-700 hover:bg-green-800">
                + Adicionar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Turma</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Turma</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Turma A"
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
                    placeholder="Ex: 2024"
                    value={formData.year}
                    onChange={(e) => handleFormChange("year", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semestre</Label>
                  <Input
                    id="semester"
                    placeholder="Ex: 1"
                    value={formData.semester}
                    onChange={(e) =>
                      handleFormChange("semester", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Curso</Label>
                  <Input
                    id="course"
                    placeholder="Ex: Ciência da Computação"
                    value={formData.course}
                    onChange={(e) => handleFormChange("course", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Máx. de Alunos</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    placeholder="Ex: 25"
                    value={formData.maxStudents}
                    onChange={(e) =>
                      handleFormChange("maxStudents", e.target.value)
                    }
                    required
                  />
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
                <DialogTitle>Editar Turma</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome da Turma</Label>
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
                  <Label htmlFor="edit-year">Ano</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={editFormData.year}
                    onChange={(e) =>
                      handleEditFormChange("year", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-semester">Semestre</Label>
                  <Input
                    id="edit-semester"
                    value={editFormData.semester}
                    onChange={(e) =>
                      handleEditFormChange("semester", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-course">Curso</Label>
                  <Input
                    id="edit-course"
                    value={editFormData.course}
                    onChange={(e) =>
                      handleEditFormChange("course", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-maxStudents">Máx. de Alunos</Label>
                  <Input
                    id="edit-maxStudents"
                    type="number"
                    value={editFormData.maxStudents}
                    onChange={(e) =>
                      handleEditFormChange("maxStudents", e.target.value)
                    }
                    required
                  />
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
            <p className="text-center">Carregando classes...</p>
          ) : (
            <>
              <Table>
                <TableCaption>
                  {searchTerm
                    ? `${filteredClasses.length} turma(s) encontrada(s)`
                    : `Classes cadastradas: ${classes.length}`}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Máx. de Alunos</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClasses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-gray-500"
                      >
                        Nenhuma classe cadastrada ainda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell>{cls.name}</TableCell>
                        <TableCell>{cls.year}</TableCell>
                        <TableCell>{cls.semester}</TableCell>
                        <TableCell>{cls.course}</TableCell>
                        <TableCell>{cls.maxStudents}</TableCell>
                        <TableCell>{formatDate(cls.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              aria-label="Editar"
                              className="text-green-700 hover:text-green-900 p-2 rounded transition-colors"
                              onClick={() => handleEditOpen(cls)}
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              type="button"
                              aria-label="Excluir"
                              className="text-red-600 hover:text-red-800 p-2 rounded transition-colors"
                              onClick={() => handleDeleteClick(cls)}
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
        description={`Tem certeza que deseja excluir a turma "${classToDelete?.name}"? Esta ação não pode ser desfeita.`}
        isDeleting={isDeleting}
      />
    </main>
  );
}
