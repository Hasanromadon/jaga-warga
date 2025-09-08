import { Input } from '../ui/input';

// Reusable search input component
export function SearchInput({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <Input
      type="text"
      placeholder="Cari nama/blok/nomor/bulan/tahun..."
      value={value}
      onChange={onChange}
      className="bg-white transition-colors placeholder:text-blue-400 placeholder:font-medium"
    />
  );
}


