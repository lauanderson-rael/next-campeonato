import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({ placeholder, value, onChange, className = "max-w-md" }: SearchInputProps) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
}