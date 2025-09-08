"use client";
import { useBills } from '../../hooks/useBills';
import LaporanList from '../../components/LaporanList';
import { Clock } from 'lucide-react';

export default function LaporanPage() {
  const { data: bills = [], isLoading, error } = useBills();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-sm pb-20">
        <h2 className="font-semibold mb-2 text-blue-900 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Laporan Pembayaran
        </h2>
        {isLoading ? (
          <div className="text-center text-blue-700 py-8">Memuat data laporan...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">Gagal memuat data laporan</div>
        ) : (
          <LaporanList bills={bills} />
        )}
      </div>
    </main>
  );
}
