"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Edit, Filter, Search } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useVerifyUserLogged } from "@/hooks/useVerifyUserLogged";

interface Team {
  id: number;
  name: string;
}

interface MatchTeam {
  team: Team;
  goalsTeam: number;
}

interface Championship {
  id: number;
  name: string;
  year: number;
  modality: string;
}

interface Match {
  id: number;
  playDay: string | null;
  status: number;
  championship: Championship;
  matchTeams: MatchTeam[];
}

function MatchesList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const championshipIdFromQuery = searchParams.get("championshipId");

  const [matches, setMatches] = useState<Match[]>([]);
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [selectedChampionshipId, setSelectedChampionshipId] = useState<string>(
    championshipIdFromQuery || "all"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchChampionships = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/championships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChampionships(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar campeonatos:", error);
    }
  };

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/matches`;
      if (selectedChampionshipId !== "all") {
        url += `?championshipId=${selectedChampionshipId}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar partidas:", error);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChampionshipId]);

  useEffect(() => {
    fetchChampionships();
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    if (championshipIdFromQuery) {
        setSelectedChampionshipId(championshipIdFromQuery);
    } else {
        setSelectedChampionshipId("all");
    }
  }, [championshipIdFromQuery]);

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.championship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.matchTeams.some((mt) =>
        mt.team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = 
      statusFilter === "all" || match.status === Number(statusFilter);

    return matchesSearch && matchesStatus;
  });

  function formatDateTime(date?: string | null) {
    if (!date) return <span className="text-gray-400">–</span>;
    const d = new Date(date);
    if (isNaN(d.getTime())) return <span className="text-gray-400">–</span>;
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatusText(status: number) {
    switch (status) {
      case 0: return "Agendada";
      case 1: return "Em andamento";
      case 2: return "Finalizada";
      default: return "Desconhecido";
    }
  }

  function getStatusColor(status: number) {
    switch (status) {
      case 0: return "bg-yellow-100 text-yellow-800";
      case 1: return "bg-blue-100 text-blue-800";
      case 2: return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  const handleChampionshipChange = (id: string) => {
    setSelectedChampionshipId(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") {
      params.delete("championshipId");
    } else {
      params.set("championshipId", id);
    }
    router.push(`/dashboard/matches?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por time ou campeonato..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={selectedChampionshipId}
              onChange={(e) => handleChampionshipChange(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Todos os campeonatos</option>
              {championships.map((champ) => (
                <option key={champ.id} value={champ.id}>
                  {champ.name} ({champ.year})
                </option>
              ))}
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todos os status</option>
            <option value="0">Agendadas</option>
            <option value="1">Em andamento</option>
            <option value="2">Finalizadas</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-20 text-center text-gray-500">Carregando partidas...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>
                Exibindo {filteredMatches.length} de {matches.length} partidas.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Campeonato</TableHead>
                  <TableHead>Confronto</TableHead>
                  <TableHead className="text-center">Placar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                      Nenhuma partida encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMatches.map((match) => {
                    const team1 = match.matchTeams[0];
                    const team2 = match.matchTeams[1];
                    return (
                      <TableRow key={match.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <div className="font-medium">{match.championship.name}</div>
                          <div className="text-xs text-gray-500">{match.championship.modality}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Shield className="text-blue-600" size={14} />
                              <span>{team1?.team.name || "Time 1"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="text-red-600" size={14} />
                              <span>{team2?.team.name || "Time 2"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-lg font-mono">
                          {match.status === 0 ? "- : -" : `${team1?.goalsTeam || 0} - ${team2?.goalsTeam || 0}`}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(match.status)}`}>
                            {getStatusText(match.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{formatDateTime(match.playDay)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-700 hover:text-green-800 border-green-200 hover:bg-green-50"
                            onClick={() => router.push(`/dashboard/championships/${match.championship.id}/matches`)}
                          >
                            <Edit size={14} className="mr-1" />
                            <span>Gerenciar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function MatchesPage() {
  useVerifyUserLogged();

  return (
    <div className="flex flex-col items-center m-4 md:m-6 space-y-4 text-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800">Partidas</h1>
        <p className="text-gray-500 mt-1">Visualize e gerencie todos os confrontos dos campeonatos.</p>
      </div>

      <Suspense fallback={<Card className="w-full max-w-4xl h-64 flex items-center justify-center">Carregando...</Card>}>
        <MatchesList />
      </Suspense>
    </div>
  );
}
