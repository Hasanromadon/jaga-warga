'use client';
import LaporanList from '../../components/LaporanList';
import { Clock } from 'lucide-react';
import { withProtectedRoute } from '../../utils/protectedRoute';

import { useAuth } from '../../hooks/useAuth';

function LaporanPage() {
  const { residentialId } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-sm pb-20">
        <h2 className="font-semibold mb-2 text-blue-900 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Laporan Pembayaran
        </h2>
        <LaporanList residentialId={residentialId ?? undefined} />
      </div>
    </main>
  );
}

export default withProtectedRoute(LaporanPage, ['admin']);
