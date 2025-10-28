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

// Interfaces
interface Class {
  id: number;
  name: string;
  year: number;
  semester: string;
  course: string;
  maxStudents: number;
}

interface FormData {
  name: string;
  year: string;
  semester: string;
  course: string;
  maxStudents: string;
}

export default function ClassesPage() {
  // Estados da listagem
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    semester: "",
    course: "",
    maxStudents: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Função para atualizar os campos do formulário
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Buscar classes do servidor
  const fetchClasses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`);
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Erro ao buscar classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar classes quando o componente montar
  useEffect(() => {
    fetchClasses();
  }, []);

  // Lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            year: Number(formData.year),
            maxStudents: Number(formData.maxStudents),
          }),
        }
      );

      if (response.ok) {
        // Limpar formulário e fechar modal
        setFormData({
          name: "",
          year: "",
          semester: "",
          course: "",
          maxStudents: "",
        });
        setModalOpen(false);
        await fetchClasses(); // Atualizar listagem
      } else {
        alert("Erro ao cadastrar classe");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center  min-h-screen p-6 space-y-6">
      <Card className="w-full max-w-lg mt-4">
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle>Classes Cadastradas</CardTitle>

          {/* Botão + Modal */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                + Adicionar
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Classe</DialogTitle>
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
                    onChange={(e) => handleFormChange("semester", e.target.value)}
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
                    onChange={(e) => handleFormChange("maxStudents", e.target.value)}
                    required
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 w-full"
                    disabled={isSaving}
                  >
                    {isSaving ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p>Carregando classes...</p>
          ) : classes.length === 0 ? (
            <p className="text-gray-500">Nenhuma classe cadastrada ainda.</p>
          ) : (
            <ul className="space-y-2">
              {classes.map((cls) => (
                <li
                  key={cls.id}
                  className="border rounded-lg p-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{cls.name}</p>
                    <p className="text-sm text-gray-600">
                      Ano: {cls.year} | Semestre: {cls.semester}
                    </p>
                    <p className="text-sm text-gray-500">
                      Curso: {cls.course} | Máx. Alunos: {cls.maxStudents}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
