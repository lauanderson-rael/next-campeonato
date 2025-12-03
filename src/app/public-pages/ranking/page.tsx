"use client";

import { useState, useEffect } from "react";
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
import { Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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


export default function PublicRankingPage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [selectedChampionshipId, setSelectedChampionshipId] = useState<
    string | null
  >(null);
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
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/championships`
      );
      const data = await res.json();
      const champsArray = Array.isArray(data) ? data : [];
      setChampionships(champsArray);
      if (champsArray.length > 0) {
        setSelectedChampionshipId(String(champsArray[0].id));
      }
    } catch (error) {
      console.error("Erro ao buscar campeonatos:", error);
      setChampionships([]);
    }
  };

  const fetchRanking = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/championships/${id}/ranking`
      );
      const data = await res.json();
      const rankingArray = Array.isArray(data) ? data : [];
      setRanking(rankingArray);
    } catch (error) {
      console.error("Erro ao buscar ranking:", error);
      setRanking([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedChampionship = Array.isArray(championships)
    ? championships.find((c) => String(c.id) === selectedChampionshipId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo_white.png"
                alt="Logo IFMA"
                width={36}
                height={36}
                className="shadow-md"
              />
              <h1 className="text-md md:text-2xl font-bold">
                IFMA Campeonatos
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/public-pages/matches"
                className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <Calendar size={18} />
                <span className="hidden md:inline font-medium">Partidas</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 bg-white text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors font-medium"
              >
                <span>Login</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <CardTitle className="text-2xl text-center">
                Tabela de Classificação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {championships.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Selecione o Campeonato:
                  </label>
                  <select
                    value={selectedChampionshipId || ""}
                    onChange={(e) => setSelectedChampionshipId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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

              {isLoading ? (
                <p className="text-center text-gray-500 py-8">
                  Carregando ranking...
                </p>
              ) : ranking.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {selectedChampionshipId
                    ? "Nenhum resultado encontrado para este campeonato."
                    : "Selecione um campeonato para ver o ranking."}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>
                      {selectedChampionship?.name} - {ranking.length} times
                    </TableCaption>
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="w-[80px] text-center font-bold">
                          Pos
                        </TableHead>
                        <TableHead className="font-bold">Time</TableHead>
                        <TableHead className="text-center font-bold">
                          P
                        </TableHead>
                        <TableHead className="text-center font-bold">
                          J
                        </TableHead>
                        <TableHead className="text-center font-bold">
                          V
                        </TableHead>
                        <TableHead className="text-center font-bold">
                          E
                        </TableHead>
                        <TableHead className="text-center font-bold">
                          D
                        </TableHead>
                        <TableHead className="text-center font-bold">
                          GP
                        </TableHead>
                        <TableHead className="text-center font-bold">
                          GC
                        </TableHead>
                        <TableHead className="text-center font-bold">
                          SG
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ranking.map((team, index) => (
                        <TableRow
                          key={team.teamId}
                          className={`hover:bg-gray-50 ${
                            index < 3 ? "bg-green-50" : ""
                          }`}
                        >
                          <TableCell className="text-center font-bold">
                            {index < 3 ? (
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white">
                                {team.position}
                              </span>
                            ) : (
                              `${team.position}º`
                            )}
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
                          <TableCell className="text-center">
                            {team.wins}
                          </TableCell>
                          <TableCell className="text-center">
                            {team.draws}
                          </TableCell>
                          <TableCell className="text-center">
                            {team.losses}
                          </TableCell>
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
                </div>
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>
                  <strong>P:</strong> Pontos
                </span>
                <span>
                  <strong>J:</strong> Jogos
                </span>
                <span>
                  <strong>V:</strong> Vitórias
                </span>
                <span>
                  <strong>E:</strong> Empates
                </span>
                <span>
                  <strong>D:</strong> Derrotas
                </span>
                <span>
                  <strong>GP:</strong> Gols Pró
                </span>
                <span>
                  <strong>GC:</strong> Gols Contra
                </span>
                <span>
                  <strong>SG:</strong> Saldo de Gols
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
