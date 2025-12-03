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
import { Shield, Zap, Filter, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Match {
  id: number;
  championshipId: number;
  championship: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  status: number;
  date: string;
  modality: string;
}

interface Championship {
  id: number;
  name: string;
  year: number;
  modality: string;
}


export default function PublicMatchesPage() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [selectedChampionshipId, setSelectedChampionshipId] =
    useState<string>("all");
  const [matches, setMatches] = useState<Match[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterModality, setFilterModality] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChampionships();
    fetchMatches();
  }, []);

  useEffect(() => {
    // Recarregar partidas quando o campeonato selecionado mudar
    fetchMatches();
  }, [selectedChampionshipId]);

  const fetchChampionships = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/public/championships`
      );
      const data = await res.json();
      const champsArray = Array.isArray(data) ? data : [];
      setChampionships(champsArray);
    } catch (error) {
      console.error("Erro ao buscar campeonatos:", error);
      setChampionships([]);
    }
  };

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const url = selectedChampionshipId === "all"
        ? `${process.env.NEXT_PUBLIC_API_URL}/public/matches`
        : `${process.env.NEXT_PUBLIC_API_URL}/public/matches?championshipId=${selectedChampionshipId}`;
      
      const res = await fetch(url);
      const data = await res.json();
      const matchesArray = Array.isArray(data) ? data : [];
      setMatches(matchesArray);
    } catch (error) {
      console.error("Erro ao buscar partidas:", error);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status: number) => {
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
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 1:
        return "bg-blue-100 text-blue-800";
      case 2:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const modalities = Array.from(new Set(matches.map((m) => m.modality)));

  const filteredMatches = matches.filter((match) => {
    const championshipMatch =
      selectedChampionshipId === "all" ||
      match.championshipId === Number(selectedChampionshipId);
    const statusMatch =
      filterStatus === "all" || match.status === Number(filterStatus);
    const modalityMatch =
      filterModality === "all" || match.modality === filterModality;
    return championshipMatch && statusMatch && modalityMatch;
  });

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
                href="/public-pages/ranking"
                className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <Trophy size={18} />
                <span className="hidden md:inline font-medium">
                  Classificação
                </span>
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
        <div className="max-w-6xl mx-auto space-y-6">
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <CardTitle className="text-2xl text-center">Partidas</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Seletor de Campeonato */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Selecione o Campeonato:
                </label>
                <select
                  value={selectedChampionshipId}
                  onChange={(e) => setSelectedChampionshipId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Todos os campeonatos</option>
                  {championships.map((champ) => (
                    <option key={champ.id} value={champ.id}>
                      {champ.name} ({champ.year}) - {champ.modality}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtros */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <Filter size={16} />
                    Filtrar por Status:
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Todas</option>
                    <option value="0">Agendadas</option>
                    <option value="1">Em andamento</option>
                    <option value="2">Finalizadas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <Filter size={16} />
                    Filtrar por Modalidade:
                  </label>
                  <select
                    value={filterModality}
                    onChange={(e) => setFilterModality(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Todas</option>
                    {modalities.map((modality) => (
                      <option key={modality} value={modality}>
                        {modality}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tabela de Partidas */}
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Carregando partidas...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>
                      {filteredMatches.length} partida(s) encontrada(s)
                    </TableCaption>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="font-bold">Campeonato</TableHead>
                      <TableHead className="font-bold">Times</TableHead>
                      <TableHead className="text-center font-bold">
                        Placar
                      </TableHead>
                      <TableHead className="text-center font-bold">
                        Status
                      </TableHead>
                      <TableHead className="font-bold">Data/Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMatches.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-gray-500 py-8"
                        >
                          Nenhuma partida encontrada com os filtros
                          selecionados.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMatches.map((match) => (
                        <TableRow key={match.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {match.championship}
                              </p>
                              <p className="text-xs text-gray-500">
                                {match.modality}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Shield className="text-blue-600" size={16} />
                                <span className="font-medium">
                                  {match.team1}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Zap className="text-red-600" size={16} />
                                <span className="font-medium">
                                  {match.team2}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="text-2xl font-bold font-mono">
                              {match.status === 2 || match.status === 1
                                ? `${match.score1} - ${match.score2}`
                                : "- : -"}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                match.status
                              )}`}
                            >
                              {getStatusText(match.status)}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(match.date)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="shadow-lg bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                <strong> Nota:</strong> Acompanhe aqui todas as partidas dos
                campeonatos do IFMA. Os resultados são atualizados em tempo real
                após cada jogo.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
