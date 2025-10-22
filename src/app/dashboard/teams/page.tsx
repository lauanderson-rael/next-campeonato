"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function TeamsPage() {
  const [name, setName] = useState("");
  const [modality, setModality] = useState("");
  const [loading, setLoading] = useState(false);

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
        alert("Time cadastrado com sucesso!");
      }
    } catch (error) {
      alert("Erro ao cadastrar time");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastro de Times</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Input
                id="modality"
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar Time"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
