"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [classId, setClassId] = useState<number | "">("");
  const [teamId, setTeamId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  // Busca jogadores
  const fetchPlayers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`);
      const data = await res.json();
      setPlayers(data);
    } catch (error) {
      console.error("Erro ao buscar jogadores:", error);
    } finally {
      setFetching(false);
    }
  };

  // Busca times para o select
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

  // Cadastro de jogador
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        setOpen(false);
        fetchPlayers(); // Atualiza listagem
      } else {
        alert("Erro ao cadastrar jogador");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center m-4 md:m-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle>Jogadores Cadastrados - {players.length}</CardTitle>

          {/* Botão e Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
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
                      setAge(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classId">ID da Turma</Label>
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

                {/* Select de times */}
                <div className="space-y-2">
                  <Label htmlFor="teamId">Time</Label>
                  <select
                    id="teamId"
                    value={teamId}
                    onChange={(e) =>
                      setTeamId(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
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
            <p>Carregando jogadores...</p>
          ) : players.length === 0 ? (
            <p className="text-gray-500">Nenhum jogador cadastrado ainda.</p>
          ) : (
            <ul className="space-y-2 max-h-[60dvh] overflow-auto">
              {players.map((player) => (
                <li
                  key={player.id}
                  className="border rounded-lg p-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{player.name}</p>
                    <p className="text-sm text-gray-600">
                      Idade: {player.age} | Turma: {player.classId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Time: {player.team?.name || player.teamId}
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
