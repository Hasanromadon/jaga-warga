'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { TrendingUp, TrendingDown, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  description: string;
  date: Date | Timestamp | { seconds: number; nanoseconds: number };
  amount: number;
  type: 'income' | 'expense';
  recorded_by: string;
  created_at?: Date | Timestamp | { seconds: number; nanoseconds: number };
}

/* ✅ Fungsi aman untuk format tanggal Firestore ke string */
function getDateString(
  date:
    | Date
    | Timestamp
    | { seconds: number; nanoseconds: number }
    | null
    | undefined,
): string {
  if (!date) return '-';

  // Plain object Firestore Timestamp (hasil serialisasi)
  if ('seconds' in date) {
    return new Date(date.seconds * 1000).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  // Timestamp instance (hasil langsung dari Firestore SDK)
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  // Native Date
  if (date instanceof Date) {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return '-';
}

/* ✅ Fungsi format Rupiah */
function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  })
    .format(num)
    .replace('Rp', 'Rp ');
}

/* 🧾 Komponen utama */
export default function FinanceList({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useRouter();
  const fetchTransactions = async (tabType: 'income' | 'expense') => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'general_transactions'),
        where('type', '==', tabType),
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Transaction,
      );
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(activeTab);
  }, [activeTab]);

  return (
    <section className="max-w-md mx-auto mt-3">
      {/* Header */}
      <div className="flex items-center space-x-3 justify-start mb-3">
        <Button
          onClick={onBack ? onBack : () => navigate.push('/dashboard')}
          variant="ghost"
          className="text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft />
        </Button>
        <h2 className="text-lg font-bold text-slate-800">Keuangan</h2>
      </div>

      {/* Tabs */}
      <div className="flex mb-3 bg-slate-100 rounded-lg p-1">
        {['income', 'expense'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'income' | 'expense')}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
              activeTab === tab
                ? tab === 'income'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'income' ? 'Pemasukan' : 'Pengeluaran'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/50">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {transactions.map((trx) => (
              <div key={trx.id} className="flex items-center gap-3 py-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    trx.type === 'income' ? 'bg-emerald-50' : 'bg-rose-50'
                  }`}
                >
                  {trx.type === 'income' ? (
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-rose-600" />
                  )}
                </div>

                {/* Detail */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 break-words">
                    <span className="font-semibold">
                      {trx.type === 'income'
                        ? 'Pemasukan dari'
                        : 'Pengeluaran untuk'}
                    </span>{' '}
                    {trx.description}
                  </p>

                  <p className="text-xs text-slate-400">
                    {getDateString(trx.date)}
                  </p>

                  {trx.recorded_by && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {trx.recorded_by}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <p
                  className={`text-sm font-semibold whitespace-nowrap ${
                    trx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {trx.type === 'income' ? '+' : '-'}
                  {formatRupiah(trx.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-slate-500 py-4">
            Belum ada catatan{' '}
            {activeTab === 'income' ? 'pemasukan' : 'pengeluaran'}.
          </p>
        )}
      </div>
    </section>
  );
}
