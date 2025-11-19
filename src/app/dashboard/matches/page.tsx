"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function MatchesPage() {
  return (
    <div className="flex flex-col items-center m-4 md:m-6">
      <h1 className="w-full text-2xl font-bold mb-4 text-center">Partidas</h1>

      <Card className="w-full max-w-4xl">
        <CardHeader></CardHeader>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <p className="text-lg text-gray-600">Em desenvolvimento</p>
            <p className="text-sm text-gray-500 mt-2">
              Esta funcionalidade estará disponível em breve
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
