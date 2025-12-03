"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Trophy,
  Users,
  Calendar,
  Target,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { ReportsSkeleton } from "./skeleton";

interface Championship {
  id: number;
  name: string;
  year: number;
  modality: string;
}

interface RankingTeam {
  teamName: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  matchesPlayed: number;
}

interface Match {
  id: number;
  status: number;
  championshipId?: number;
  championship?: {
    id: number;
    name: string;
    year: number;
  };
}

interface Team {
  id: number;
  name: string;
  [key: string]: unknown;
}

interface Player {
  id: number;
  name: string;
  [key: string]: unknown;
}

interface ModalityData {
  name: string;
  value: number;
  [key: string]: unknown;
}

interface YearData {
  year: number;
  total: number;
}

const COLORS = [
  "#16a34a",
  "#2563eb",
  "#dc2626",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

export default function ReportsPage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [ranking, setRanking] = useState<RankingTeam[]>([]);
  const [selectedChampionshipId, setSelectedChampionshipId] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Buscar ranking quando o campeonato selecionado mudar
  useEffect(() => {
    if (selectedChampionshipId) {
      fetchRanking(selectedChampionshipId);
    } else {
      setRanking([]);
    }
  }, [selectedChampionshipId]);

  const fetchRanking = async (championshipId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/championships/${championshipId}/ranking`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const rankingData = await response.json();
      // Pegar top 5 e ordenar por pontos
      const topRanking = Array.isArray(rankingData)
        ? rankingData
            .sort((a: RankingTeam, b: RankingTeam) => b.points - a.points)
            .slice(0, 5)
        : [];
      setRanking(topRanking);
    } catch (error) {
      console.error("Erro ao buscar ranking:", error);
      setRanking([]);
    }
  };

  // Função para download de relatórios
  const downloadReport = async (
    endpoint: string,
    filename: string,
    format: "csv" | "xlsx"
  ) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${endpoint}?format=${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao baixar relatório");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      alert("Erro ao baixar relatório. Tente novamente.");
    }
  };

  const fetchAllData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [champsRes, teamsRes, playersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/championships`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/players`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const champsData = await champsRes.json();
      const teamsData = await teamsRes.json();
      const playersData = await playersRes.json();

      const champsArray = Array.isArray(champsData) ? champsData : [];
      setChampionships(champsArray);
      setTeams(Array.isArray(teamsData) ? teamsData : []);
      setPlayers(Array.isArray(playersData) ? playersData : []);

      // Definir primeiro campeonato como selecionado por padrão
      if (champsArray.length > 0 && !selectedChampionshipId) {
        setSelectedChampionshipId(String(champsArray[0].id));
      }

      // Buscar TODAS as partidas para os relatórios gerais
      const matchesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/matches`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const matchesData = await matchesRes.json();
      setMatches(Array.isArray(matchesData) ? matchesData : []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Dados para gráficos
  const modalityData = championships.reduce((acc: ModalityData[], champ) => {
    const existing = acc.find((item) => item.name === champ.modality);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: champ.modality, value: 1 });
    }
    return acc;
  }, []);

  // Dados de Campeonatos por Ano
  const championshipsByYear = championships
    .reduce((acc: YearData[], champ) => {
      const existing = acc.find((item) => item.year === champ.year);
      if (existing) {
        existing.total += 1;
      } else {
        acc.push({ year: champ.year, total: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => a.year - b.year);

  // Dados de Partidas por Ano (baseado no ano do campeonato de cada partida)
  const matchesByYear = matches
    .filter((match) => match.championship?.year)
    .reduce((acc: YearData[], match) => {
      const year = match.championship!.year;
      const existing = acc.find((item) => item.year === year);
      if (existing) {
        existing.total += 1;
      } else {
        acc.push({ year, total: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => a.year - b.year);

  const matchStatusData = [
    { name: "Agendadas", value: matches.filter((m) => m.status === 0).length },
    {
      name: "Em andamento",
      value: matches.filter((m) => m.status === 1).length,
    },
    {
      name: "Finalizadas",
      value: matches.filter((m) => m.status === 2).length,
    },
  ].filter((item) => item.value > 0);

  const topTeamsData = ranking.map((team) => ({
    name:
      team.teamName.length > 15
        ? team.teamName.substring(0, 15) + "..."
        : team.teamName,
    pontos: team.points,
    vitórias: team.wins,
  }));

  if (isLoading) {
    return <ReportsSkeleton />;
  }

  return (
    <div className="flex flex-col items-center p-4 md:px-6 mt-1">
      <div className="w-full max-w-6xl flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Relatórios e Estatísticas</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <button
            onClick={() =>
              downloadReport(
                "players-by-modality",
                "jogadores_por_modalidade",
                "csv"
              )
            }
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            title="Baixar CSV"
          >
            <Download size={16} />
            CSV - Jogadores por Modalidade
          </button>
          <button
            onClick={() =>
              downloadReport(
                "players-by-modality",
                "jogadores_por_modalidade",
                "xlsx"
              )
            }
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            title="Baixar XLSX"
          >
            <FileSpreadsheet size={16} />
            XLSX - Jogadores por Modalidade
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Campeonatos
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {championships.length}
                </p>
              </div>
              <Trophy className="text-green-600" size={40} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-blue-600 font-medium">Times</p>
                <p className="text-3xl font-bold text-blue-700">
                  {teams.length}
                </p>
              </div>
              <Users className="text-blue-600" size={40} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-purple-600 font-medium">Jogadores</p>
                <p className="text-3xl font-bold text-purple-700">
                  {players.length}
                </p>
              </div>
              <Target className="text-purple-600" size={40} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-orange-600 font-medium">Partidas</p>
                <p className="text-3xl font-bold text-orange-700">
                  {matches.length}
                </p>
              </div>
              <Calendar className="text-orange-600" size={40} />
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Modalidades */}
          {modalityData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Campeonatos por Modalidade
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={modalityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {modalityData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Gráfico de Status das Partidas */}
          {matchStatusData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status das Partidas</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={matchStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {matchStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Gráfico de Partidas por Ano */}
          {matchesByYear.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Partidas por Ano</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={matchesByYear}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#16a34a"
                      strokeWidth={2}
                      name="Total de Partidas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Gráfico de Campeonatos por Ano */}
          {championshipsByYear.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campeonatos por Ano</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={championshipsByYear}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#2563eb"
                      strokeWidth={2}
                      name="Total de Campeonatos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Gráfico Top 5 Times */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <CardTitle className="text-lg">Top 5 Times - Ranking</CardTitle>
                {selectedChampionshipId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        downloadReport(
                          `top-teams/${selectedChampionshipId}`,
                          "melhores_times",
                          "csv"
                        )
                      }
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs"
                      title="Baixar CSV"
                    >
                      <Download size={14} />
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        downloadReport(
                          `top-teams/${selectedChampionshipId}`,
                          "melhores_times",
                          "xlsx"
                        )
                      }
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
                      title="Baixar XLSX"
                    >
                      <FileSpreadsheet size={14} />
                      XLSX
                    </button>
                    <button
                      onClick={() =>
                        downloadReport(
                          `matches/${selectedChampionshipId}`,
                          "resultados_partidas",
                          "csv"
                        )
                      }
                      className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs"
                      title="Baixar Resultados CSV"
                    >
                      <Download size={14} />
                      Partidas CSV
                    </button>
                    <button
                      onClick={() =>
                        downloadReport(
                          `champions/${selectedChampionshipId}`,
                          "campeoes",
                          "xlsx"
                        )
                      }
                      className="flex items-center gap-1 px-3 py-1.5 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-xs"
                      title="Baixar Campeões XLSX"
                    >
                      <Trophy size={14} />
                      Campeões
                    </button>
                  </div>
                )}
              </div>
              {championships.length > 0 && (
                <div className="mb-4">
                  <label
                    htmlFor="championship-select"
                    className="block text-sm font-medium mb-2"
                  >
                    Selecione o Campeonato:
                  </label>
                  <select
                    id="championship-select"
                    value={selectedChampionshipId || ""}
                    onChange={(e) => setSelectedChampionshipId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            </CardHeader>
            {topTeamsData.length > 0 && (
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topTeamsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pontos" fill="#16a34a" name="Pontos" />
                    <Bar dataKey="vitórias" fill="#2563eb" name="Vitórias" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            )}
            {topTeamsData.length === 0 && selectedChampionshipId && (
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Nenhum dado de ranking disponível para este campeonato.
                </p>
              </CardContent>
            )}
            {!selectedChampionshipId && (
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Selecione um campeonato para ver o ranking.
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
