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

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [name, setName] = useState("");
  const [modality, setModality] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`);
      const data = await res.json();
      setTeams(data);
    } catch (error) {
      console.error("Erro ao buscar times:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, modality }),
      });

      if (response.ok) {
        setName("");
        setModality("");
        setOpen(false);
        fetchTeams(); // Atualiza lista
      } else {
        alert("Erro ao cadastrar time");
      }
    } catch (error) {
      alert("Erro ao cadastrar time");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center  min-h-screen p-6 space-y-6">
      {/* Card de Listagem */}
      <Card className="w-full max-w-lg mt-4">
        <CardHeader className="flex justify-between items-center flex-row">
          <CardTitle>Times Cadastrados</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidade</Label>
                  <select
                    id="modality"
                    value={modality}
                    onChange={(e) => setModality(e.target.value)}
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
            <p>Carregando times...</p>
          ) : teams.length === 0 ? (
            <p className="text-gray-500">Nenhum time cadastrado ainda.</p>
          ) : (
            <ul className="space-y-2">
              {teams.map((team) => (
                <li
                  key={team.id}
                  className="border rounded-lg p-2 flex justify-between items-center"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <p className="font-semibold">{team.name}</p> -
                    <p className="text-sm text-gray-600">{team.modality}</p>
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
