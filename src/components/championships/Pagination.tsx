import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 mt-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
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
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ArrowRight size={18} />
      </Button>
    </div>
  );
}