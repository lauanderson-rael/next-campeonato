"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Shield, Zap, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";

interface Team {
  id: number;
  name: string;
  modality: string;
}

interface MatchTeam {
  id: number;
  matchId: number;
  teamId: number;
  goalsTeam: number;
  pointsTeam: number;
  team: Team;
}

interface Championship {
  id: number;
  name: string;
  year: number;
}

interface Match {
  id: number;
  championshipId: number;
  playDay: string | null;
  status: number;
  createdAt: string;
  updatedAt: string;
  championship: Championship;
  matchTeams: MatchTeam[];
}

export default function ChampionshipMatchesPage() {
  const params = useParams();
  const router = useRouter();
  const championshipId = params.id as string;

  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [championshipName, setChampionshipName] = useState("");

  // Modal de resultado
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [resultData, setResultData] = useState({
    team1Goals: "",
    team2Goals: "",
    playDay: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(matches.length / itemsPerPage);
  const paginatedMatches = matches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function formatDate(date?: string | null) {
    if (!date) return <span className="text-gray-400">–</span>;
    const d = new Date(date);
    if (isNaN(d.getTime())) return <span className="text-gray-400">–</span>;
    return d.toLocaleDateString("pt-BR");
  }

  function formatDateTime(date?: string | null) {
    if (!date) return <span className="text-gray-400">–</span>;
    const d = new Date(date);
    if (isNaN(d.getTime())) return <span className="text-gray-400">–</span>;
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function getStatusText(status: number) {
    switch (status) {
      case 0:
        return "Agendada";
      case 1:
        return "Em andamento";
      case 2:
        return "Finalizada";
      default:
        return "Desconhecido";
    }
  }

  function getStatusColor(status: number) {
    switch (status) {
      case 0:
        return "text-yellow-600";
      case 1:
        return "text-blue-600";
      case 2:
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  }

  const fetchMatches = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/matches?championshipId=${championshipId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setMatches(data);
      if (data.length > 0) {
        setChampionshipName(data[0].championship.name);
      }
    } catch (error) {
      console.error("Erro ao buscar partidas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [championshipId]);

  const handleResultClick = (match: Match) => {
    setSelectedMatch(match);
    setResultData({
      team1Goals: String(match.matchTeams[0]?.goalsTeam || 0),
      team2Goals: String(match.matchTeams[1]?.goalsTeam || 0),
      playDay: match.playDay ? new Date(match.playDay).toISOString().slice(0, 16) : "",
    });
    setResultModalOpen(true);
  };

  const handleResultFormChange = (field: string, value: string) => {
    setResultData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/matches/${selectedMatch.id}/result`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            results: [
              {
                teamId: selectedMatch.matchTeams[0].teamId,
                goals: Number(resultData.team1Goals),
              },
              {
                teamId: selectedMatch.matchTeams[1].teamId,
                goals: Number(resultData.team2Goals),
              },
            ],
            playDay: resultData.playDay ? new Date(resultData.playDay).toISOString() : null,
          }),
        }
      );
      if (response.ok) {
        setResultModalOpen(false);
        await fetchMatches();
        alert("Resultado registrado com sucesso!");
      } else {
        alert("Erro ao registrar resultado");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor");
      console.error("Erro ao registrar resultado:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex flex-col items-center p-4 md:px-6">
      <div className="w-full max-w-4xl mb-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft size={18} className="mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-center">
          Partidas - {championshipName}
        </h1>
      </div>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Listagem de Partidas</CardTitle>
        </CardHeader>

        <CardContent className="max-h-[60dvh] overflow-y-auto">
          {isLoading ? (
            <p>Carregando partidas...</p>
          ) : (
            <>
              <Table>
                <TableCaption>
                  Partidas encontradas: {matches.length}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Times</TableHead>
                    <TableHead>Placar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data da Partida</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMatches.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-gray-500"
                      >
                        Nenhuma partida encontrada para este campeonato.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedMatches.map((match) => {
                      const team1 = match.matchTeams[0];
                      const team2 = match.matchTeams[1];

                      return (
                        <TableRow key={match.id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <Shield className="text-blue-600" size={16} />
                                <span>{team1?.team.name || "Time 1"}</span>
                              </div>

                              <span className="text-gray-500 pl-10">vs</span>

                              <div className="flex items-center gap-2">
                                <Zap className="text-red-600" size={16} />
                                <span>{team2?.team.name || "Time 2"}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center font-mono">
                              {team1?.goalsTeam || 0} - {team2?.goalsTeam || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={getStatusColor(match.status)}>
                              {getStatusText(match.status)}
                            </span>
                          </TableCell>
                          <TableCell>{formatDateTime(match.playDay)}</TableCell>
                          <TableCell>{formatDate(match.createdAt)}</TableCell>
                          <TableCell>
                            <button
                              type="button"
                              aria-label="Registrar resultado"
                              className="text-green-600 hover:text-green-800 p-2 rounded transition-colors"
                              onClick={() => handleResultClick(match)}
                            >
                              <Edit size={18} />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              {/* Paginação */}
              <div className="flex items-center justify-center gap-2 py-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ArrowLeft size={18} />
                </Button>
                <span className="px-2 text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ArrowRight size={18} />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de resultado */}
      <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Resultado</DialogTitle>
          </DialogHeader>
          {selectedMatch && (
            <form onSubmit={handleResultSubmit} className="space-y-4 mt-2">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Shield className="text-blue-600" size={16} />
                    <span className="font-medium">{selectedMatch.matchTeams[0]?.team.name}</span>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    value={resultData.team1Goals}
                    onChange={(e) => handleResultFormChange("team1Goals", e.target.value)}
                    className="w-20 text-center"
                    required
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <Zap className="text-red-600" size={16} />
                    <span className="font-medium">{selectedMatch.matchTeams[1]?.team.name}</span>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    value={resultData.team2Goals}
                    onChange={(e) => handleResultFormChange("team2Goals", e.target.value)}
                    className="w-20 text-center"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="playDay">Data e Hora da Partida</Label>
                <Input
                  id="playDay"
                  type="datetime-local"
                  value={resultData.playDay}
                  onChange={(e) => handleResultFormChange("playDay", e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 w-full"
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Registrar Resultado"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
