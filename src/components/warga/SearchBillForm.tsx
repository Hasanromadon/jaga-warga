'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, Home, Calendar, Loader2 } from 'lucide-react';
import {
  BLOK_LIST,
  HOUSE_NUMBER_LIST,
  BULAN_LIST,
  TAHUN_LIST,
} from '@/constants';
import ResidentDetails from '@/components/warga/ResidentDetails';

interface SearchBillFormProps {
  onSearch: (filters: {
    blok: string;
    nomor: string;
    bulan: string;
    tahun: string;
  }) => Promise<void>;
  loading: boolean;
}

const SearchBillForm: React.FC<SearchBillFormProps> = ({
  onSearch,
  loading,
}) => {
  const [blok, setBlok] = useState('');
  const [nomor, setNomor] = useState('');
  const [bulan, setBulan] = useState('');
  const [tahun, setTahun] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ blok, nomor, bulan, tahun });
  };

  return (
    <form
      className="flex flex-col gap-5 animate-fade-in"
      onSubmit={handleSearch}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold flex items-center gap-1">
            <Home className="w-4 h-4" />
            Blok & Nomor Rumah
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select
                value={blok}
                onValueChange={(value) => {
                  setBlok(value);
                  setNomor('');
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Blok" />
                </SelectTrigger>
                <SelectContent>
                  {BLOK_LIST.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={nomor} onValueChange={setNomor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Nomor" />
                </SelectTrigger>
                <SelectContent>
                  {HOUSE_NUMBER_LIST.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {blok && nomor && <ResidentDetails blok={blok} nomor={nomor} />}

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Periode Tagihan
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select value={bulan} onValueChange={setBulan}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {BULAN_LIST.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={tahun} onValueChange={setTahun}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {TAHUN_LIST.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading || !blok || !nomor || !bulan || !tahun}
        className="w-full mt-1 flex items-center justify-center gap-2 text-base h-11 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Search className="w-5 h-5" />
        )}{' '}
        Cek Tagihan
      </Button>
    </form>
  );
};

export default SearchBillForm;
