"use client";
import { useBills } from "../../hooks/useBills";
import LaporanList from "../../components/LaporanList";
import { Clock } from "lucide-react";
import { withProtectedRoute } from "../../utils/protectedRoute";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

function LaporanPage() {
  const { residentialId } = useAuth();
  const [search, setSearch] = useState("");
  const {
    data: bills = [],
    isLoading,
    error,
  } = useBills(
    residentialId ?? undefined,
    search.trim() ? search.trim().toLowerCase() : undefined
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-sm pb-20">
        <h2 className="font-semibold mb-2 text-blue-900 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Laporan Pembayaran
        </h2>
        <input
          type="text"
          placeholder="Cari blok, nomor, bulan, tahun, catatan..."
          className="w-full mb-3 px-3 py-2 border border-blue-200 rounded text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isLoading ? (
          <div className="text-center text-blue-700 py-8">
            Memuat data laporan...
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">
            Gagal memuat data laporan
          </div>
        ) : (
          <LaporanList bills={bills} />
        )}
      </div>
    </main>
  );
}

export default withProtectedRoute(LaporanPage, ["admin"]);
