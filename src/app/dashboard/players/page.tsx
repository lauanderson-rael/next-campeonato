"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PlayersPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [classId, setClassId] = useState<number | "">("");
  const [teamId, setTeamId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/players`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            age: Number(age),
            classId: Number(classId),
            teamId: Number(teamId),
          }),
        }
      );

      if (response.ok) {
        setName("");
        setAge("");
        setClassId("");
        setTeamId("");
        setMessage("✅ Jogador cadastrado com sucesso!");
      } else {
        setMessage("❌ Erro ao cadastrar jogador.");
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
          <CardTitle>Cadastro de Jogadores</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Jogador</Label>
              <Input
                id="name"
                placeholder="Ex: João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                placeholder="Ex: 20"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value === "" ? "" : Number(e.target.value))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId">ID da Turma (classId)</Label>
              <Input
                id="classId"
                type="number"
                placeholder="Ex: 1"
                value={classId}
                onChange={(e) =>
                  setClassId(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamId">ID do Time (teamId)</Label>
              <Input
                id="teamId"
                type="number"
                placeholder="Ex: 6"
                value={teamId}
                onChange={(e) =>
                  setTeamId(e.target.value === "" ? "" : Number(e.target.value))
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading || !name || !age || !classId || !teamId}
            >
              {loading ? "Cadastrando..." : "Cadastrar Jogador"}
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
