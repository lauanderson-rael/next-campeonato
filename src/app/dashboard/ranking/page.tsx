"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";

interface RankingTeam {
  position: number;
  teamId: number;
  teamName: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  matchesPlayed: number;
}

interface Championship {
  id: number;
  name: string;
  year: number;
  modality: string;
}

export default function RankingPage() {
  const searchParams = useSearchParams();
  const championshipId = searchParams.get("championshipId");

  const [championships, setChampionships] = useState<Championship[]>([]);
  const [selectedChampionshipId, setSelectedChampionshipId] = useState<
    string | null
  >(championshipId);
  const [ranking, setRanking] = useState<RankingTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChampionships();
  }, []);

  useEffect(() => {
    if (selectedChampionshipId) {
      fetchRanking(selectedChampionshipId);
    } else {
      setRanking([]);
      setIsLoading(false);
    }
  }, [selectedChampionshipId]);

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
      const data = await res.json();
      setChampionships(data);
      if (data.length > 0 && !selectedChampionshipId) {
        setSelectedChampionshipId(String(data[0].id));
      }
    } catch (error) {
      console.error("Erro ao buscar campeonatos:", error);
    }
  };

  const fetchRanking = async (id: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/championships/${id}/ranking`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setRanking(data);
    } catch (error) {
      console.error("Erro ao buscar ranking:", error);
      setRanking([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedChampionship = championships.find(
    (c) => String(c.id) === selectedChampionshipId
  );

  return (
    <div className="flex flex-col items-center m-4 md:m-6">
      <h1 className="w-full text-2xl font-bold mb-4 text-center">
        Tabela de Classificação
      </h1>

      {championships.length > 0 && (
        <div className="w-full max-w-4xl mb-4">
          <label className="block text-sm font-medium mb-2">
            Selecione o Campeonato:
          </label>
          <select
            value={selectedChampionshipId || ""}
            onChange={(e) => setSelectedChampionshipId(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Selecione um campeonato</option>
            {championships.map((champ) => (
              <option key={champ.id} value={champ.id}>
                {champ.name} ({champ.year}) - {champ.modality}
              </option>
            ))}
          </select>
        </div>
      )}

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center">
            {selectedChampionship
              ? `${selectedChampionship.name} - ${selectedChampionship.modality}`
              : "Selecione um campeonato"}
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[60dvh] overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-gray-500">Carregando ranking...</p>
          ) : ranking.length === 0 ? (
            <p className="text-center text-gray-500">
              {selectedChampionshipId
                ? "Nenhum resultado encontrado para este campeonato."
                : "Selecione um campeonato para ver o ranking."}
            </p>
          ) : (
            <Table>
              <TableCaption>
                Ranking do campeonato: {ranking.length} times
              </TableCaption>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[80px] text-center">Pos</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-center">P</TableHead>
                  <TableHead className="text-center">J</TableHead>
                  <TableHead className="text-center">V</TableHead>
                  <TableHead className="text-center">E</TableHead>
                  <TableHead className="text-center">D</TableHead>
                  <TableHead className="text-center">GP</TableHead>
                  <TableHead className="text-center">GC</TableHead>
                  <TableHead className="text-center">SG</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking.map((team) => (
                  <TableRow key={team.teamId} className="hover:bg-gray-50">
                    <TableCell className="text-center font-medium">
                      {team.position}º
                    </TableCell>
                    <TableCell className="font-medium">
                      {team.teamName}
                    </TableCell>
                    <TableCell className="text-center font-bold text-green-600">
                      {team.points}
                    </TableCell>
                    <TableCell className="text-center">
                      {team.matchesPlayed}
                    </TableCell>
                    <TableCell className="text-center">{team.wins}</TableCell>
                    <TableCell className="text-center">{team.draws}</TableCell>
                    <TableCell className="text-center">{team.losses}</TableCell>
                    <TableCell className="text-center">
                      {team.goalsFor}
                    </TableCell>
                    <TableCell className="text-center">
                      {team.goalsAgainst}
                    </TableCell>
                    <TableCell className="text-center">
                      {team.goalDifference >= 0
                        ? `+${team.goalDifference}`
                        : team.goalDifference}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
