import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Theater } from "lucide-react";
import Image from "next/image";
import LoginButton from "./loginButton";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-2xl mb-4">Sistema de Campeonatos</h2>

      <LoginButton />
    </div>
  );
}
