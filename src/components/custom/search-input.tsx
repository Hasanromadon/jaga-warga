import { Input } from '../ui/input';
import { Search as SearchIcon } from 'lucide-react';

// Reusable search input component
export function SearchInput({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
        <SearchIcon className="w-5 h-5" />
      </span>
      <Input
        type="text"
        placeholder="Cari nama/blok/nomor/bulan/tahun..."
        value={value}
        onChange={onChange}
        className="pl-10 bg-white transition-colors placeholder:text-blue-400 placeholder:font-medium h-11"
      />
    </div>
  );
}


