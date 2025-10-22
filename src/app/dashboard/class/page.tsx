"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ClassesPage() {
  const [name, setName] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [maxStudents, setMaxStudents] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

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
        setMessage("✅ Classe cadastrada com sucesso!");
      } else {
        setMessage("❌ Erro ao cadastrar classe.");
      }
    } catch (error) {
      setMessage("❌ Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastro de Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  setYear(e.target.value === "" ? "" : Number(e.target.value))
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

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={
                loading ||
                !name ||
                !year ||
                !semester ||
                !course ||
                !maxStudents
              }
            >
              {loading ? "Cadastrando..." : "Cadastrar Classe"}
            </Button>

            {message && (
              <p className="text-center text-sm font-medium text-green-600 mt-2">
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
