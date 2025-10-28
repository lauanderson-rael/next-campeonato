"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Exemplo mínimo apenas para visualização do layout
const mockTeams = [
  { position: 1, name: "Time A", points: 9 },
  { position: 2, name: "Time B", points: 6 },
  { position: 3, name: "Time C", points: 3 },
  { position: 4, name: "Time D", points: 1 },
  { position: 5, name: "Time E", points: 0 },
  { position: 6, name: "Time F", points: 0 },
  { position: 7, name: "Time G", points: 0 },
  { position: 8, name: "Time H", points: 0 },
  { position: 9, name: "Time I", points: 0 },
  { position: 10, name: "Time J", points: 0 },
  { position: 11, name: "Time K", points: 0 },
  { position: 12, name: "Time L", points: 0 },
  { position: 13, name: "Time M", points: 0 },
  { position: 14, name: "Time N", points: 0 },
  { position: 15, name: "Time O", points: 0 },
  { position: 16, name: "Time P", points: 0 },
  { position: 17, name: "Time Q", points: 0 },
];

export default function RankingPage() {
  return (
    <div className="flex flex-col items-center m-4 md:m-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-green-600">
            Tabela de Classificação
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[60dvh] overflow-y-auto ">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-[100px] text-center">Posição</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-center">Pontos</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {mockTeams.map((team) => (
                <TableRow key={team.name} className="hover:bg-gray-50">
                  <TableCell className="text-center font-medium">
                    {team.position}º
                  </TableCell>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell className="text-center font-bold text-green-600">
                    {team.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 text-center text-sm text-gray-500">
            Dados provisórios para visualização do layout
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
