"use client";

import { useState, useEffect, useCallback } from "react";
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
  format?: string;
}

interface MatchTeam {
  id: number;
  teamId: number;
  goalsTeam?: number;
  team: {
    id: number;
    name: string;
  };
}

interface Match {
  id: number;
  round?: number | null;
  bracketOrder?: number | null;
  isKnockout?: boolean;
  status?: number;
  matchTeams: MatchTeam[];
}

export default function RankingPage() {
  const searchParams = useSearchParams();
  const championshipId = searchParams.get("championshipId");

  const [championships, setChampionships] = useState<Championship[]>([]);
  const [selectedChampionshipId, setSelectedChampionshipId] = useState<
    string | null
  >(championshipId);
  const [ranking, setRanking] = useState<RankingTeam[]>([]);
  const [knockoutMatches, setKnockoutMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChampionships = useCallback(async () => {
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
  }, [selectedChampionshipId]);

  useEffect(() => {
    fetchChampionships();
  }, [fetchChampionships]);

  useEffect(() => {
    if (selectedChampionshipId) {
      fetchRanking(selectedChampionshipId);
    } else {
      setRanking([]);
      setKnockoutMatches([]);
      setIsLoading(false);
    }
  }, [selectedChampionshipId]);

  const fetchRanking = async (id: string) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const [rankingRes, matchesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/championships/${id}/ranking`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches?championshipId=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const rankingData = await rankingRes.json();
      setRanking(Array.isArray(rankingData) ? rankingData : []);

      if (matchesRes.ok) {
        const matchesData = await matchesRes.json();
        const normalizedMatches = Array.isArray(matchesData) ? matchesData : [];
        setKnockoutMatches(normalizedMatches.filter((match) => match.isKnockout));
      } else {
        setKnockoutMatches([]);
      }
    } catch (error) {
      console.error("Erro ao buscar ranking:", error);
      setRanking([]);
      setKnockoutMatches([]);
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
          ) : selectedChampionship?.format === "Mata-Mata" ? (
            knockoutMatches.length === 0 ? (
              <p className="text-center text-gray-500">
                Nenhum confronto mata-mata encontrado para este campeonato.
              </p>
            ) : (
              <div className="space-y-4">
                {Array.from(
                  new Map(
                    knockoutMatches
                      .sort((a, b) => {
                        const roundA = a.round ?? 0;
                        const roundB = b.round ?? 0;
                        if (roundA !== roundB) return roundA - roundB;
                        const orderA = a.bracketOrder ?? 0;
                        const orderB = b.bracketOrder ?? 0;
                        return orderA - orderB;
                      })
                      .map((match) => [match.round ?? 0, match])
                  )
                ).map(([round]) => {
                  const roundMatches = knockoutMatches
                    .filter((match) => (match.round ?? 0) === round)
                    .sort((a, b) => (a.bracketOrder ?? 0) - (b.bracketOrder ?? 0));

                  return (
                    <div key={round} className="rounded-lg border border-gray-200">
                      <div className="bg-gray-100 text-gray-700 px-4 py-2 text-sm font-semibold">
                        Rodada {round}
                      </div>
                      <div className="divide-y">
                        {roundMatches.map((match) => {
                          const [teamA, teamB] = [...match.matchTeams].sort(
                            (a, b) => a.id - b.id
                          );
                          const hasResult =
                            match.status === 2 &&
                            typeof teamA?.goalsTeam === "number" &&
                            typeof teamB?.goalsTeam === "number";
                          return (
                            <div
                              key={match.id}
                              className="grid grid-cols-3 items-center gap-3 px-4 py-3 text-sm"
                            >
                              <span className="font-medium text-gray-800">
                                {teamA?.team?.name ?? "Time A"}
                              </span>
                              <span className="text-center text-gray-500">
                                {hasResult
                                  ? `${teamA?.goalsTeam ?? 0} x ${teamB?.goalsTeam ?? 0}`
                                  : "vs"}
                              </span>
                              <span className="font-medium text-gray-800">
                                {teamB?.team?.name ?? "Time B"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
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
