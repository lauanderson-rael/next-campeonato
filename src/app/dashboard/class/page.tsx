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

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [maxStudents, setMaxStudents] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  // Buscar classes
  const fetchClasses = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`);
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error("Erro ao buscar classes:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Cadastro de classe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            year: Number(year),
            semester,
            course,
            maxStudents: Number(maxStudents),
          }),
        }
      );

      if (response.ok) {
        setName("");
        setYear("");
        setSemester("");
        setCourse("");
        setMaxStudents("");
        setOpen(false);
        fetchClasses(); // Atualiza a listagem
      } else {
        alert("Erro ao cadastrar classe");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center  min-h-screen p-6 space-y-6">
      <Card className="w-full max-w-lg mt-4">
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle>Classes Cadastradas</CardTitle>

          {/* Botão + Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="Ex: 2024"
                    value={year}
                    onChange={(e) =>
                      setYear(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semestre</Label>
                  <Input
                    id="semester"
                    placeholder="Ex: 1"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Curso</Label>
                  <Input
                    id="course"
                    placeholder="Ex: Ciência da Computação"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Máx. de Alunos</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    placeholder="Ex: 25"
                    value={maxStudents}
                    onChange={(e) =>
                      setMaxStudents(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    required
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 w-full"
                    disabled={loading}
                  >
                    {loading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {fetching ? (
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
