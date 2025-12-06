'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardStats, useActivities } from '@/hooks/useDashboard';
import { useAdGeneratorModal } from '@/context/AdGeneratorModalProvider';
import FastMenu, { ViewType } from '@/components/FastMenu';
import StatCard from '@/components/StatCard';

// --- Tipe dan Helper ---
interface User {
  displayName: string;
  photoURL: string;
}

interface Stats {
  totalIncome: number;
  totalExpenses: number;
  totalBills: number;
  pendingBills: number;
}

type ActivityType = 'income' | 'expense';

interface Activity {
  id: string;
  type: ActivityType;
  user: string;
  amount: number;
  time: string;
}

const formatRupiah = (number: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);

// --- Komponen Utama Dashboard ---
interface DashboardPageProps {
  user: User;
  stats: Stats;
  activities: Activity[];
}

function DashboardPage({ user }: DashboardPageProps) {
  const router = useRouter();
  const { openModal } = useAdGeneratorModal();

  const {
    data: stats = {
      totalIncome: 0,
      totalExpenses: 0,
      totalBills: 0,
      pendingBills: 0,
    },
  } = useDashboardStats();
  const { data: activities = [] } = useActivities();

  const handleFastMenuSelect = (menu: ViewType) => {
    if (menu === 'buat-iklan') {
      openModal();
    } else if (menu === 'promo') {
      router.push('/promo');
    } else {
      router.push(`/dashboard/${menu}`);
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-800">
      <main className="w-full max-w-md mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <header className="flex items-center gap-4">
            <div>
              <p className="text-xs text-slate-500">Selamat datang,</p>
              <h1 className="text-xl font-bold text-slate-900">
                {user.displayName}
              </h1>
            </div>
          </header>

          {/* Kartu Saldo */}
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg shadow-blue-500/20 p-6 text-white overflow-hidden">
            <div className="absolute -top-4 -right-4 w-28 h-28 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-2 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
              <p className="text-sm font-light text-blue-100">Saldo Saat Ini</p>
              <p className="text-2xl font-bold mt-1 break-words">
                {formatRupiah(stats.totalIncome - stats.totalExpenses)}
              </p>
              <div className="mt-4 text-xs bg-white/20 px-3 py-1 rounded-full inline-block">
                Diperbarui: 21 Oktober 2025, 15:29
              </div>
            </div>
          </div>

          <section className="bg-white rounded-2xl p-2 shadow-sm">
            <div className="flex items-center mx-2">
              <div className="flex-1 flex items-center">
                <StatCard
                  title="Pemasukan"
                  value={formatRupiah(stats.totalIncome)}
                  icon={<TrendingUp className="w-5 h-5 text-green-500" />}
                  color={{ bg: 'bg-green-100', text: 'text-green-600' }}
                />
              </div>

              <div className="w-px h-10 bg-slate-100 mx-2" />

              <div className="flex-1 flex items-center">
                <StatCard
                  title="Pengeluaran"
                  value={formatRupiah(stats.totalExpenses)}
                  icon={<TrendingDown className="w-5 h-5 text-red-500" />}
                  color={{ bg: 'bg-red-100', text: 'text-red-600' }}
                />
              </div>
            </div>
            <div className="w-full h-px bg-slate-100 mx-2 mb-3" />
            <FastMenu onSelect={handleFastMenuSelect} />
          </section>

          {/* Aktivitas */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Aktivitas Terbaru
            </h2>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/50">
              <div className="divide-y divide-slate-100">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 py-3"
                    >
                      <div
                        className={`w-10 h-10 ${
                          activity.type === 'income'
                            ? 'bg-green-100'
                            : 'bg-red-100'
                        } rounded-full flex items-center justify-center flex-shrink-0`}
                      >
                        {activity.type === 'income' ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 break-words">
                          <span className="font-semibold">
                            {activity.type === 'income'
                              ? 'Pemasukkan'
                              : 'Pengeluaran'}
                          </span>{' '}
                          <br />
                          {activity.user}
                        </p>
                        <p className="text-xs text-slate-400">
                          {activity.time}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-semibold whitespace-nowrap text-right ${
                          activity.type === 'income'
                            ? 'text-green-600'
                            : 'text-slate-700'
                        }`}
                      >
                        {activity.type === 'income' ? '+' : ''}
                        {formatRupiah(activity.amount)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sm text-slate-500 py-4">
                    Belum ada aktivitas.
                  </p>
                )}
              </div>
              {activities.length > 0 && (
                <button
                  onClick={() => router.push('/dashboard/keuangan')}
                  className="w-full text-center text-sm font-semibold text-blue-600 mt-4 pt-3 border-t border-slate-100 hover:underline disabled:text-slate-400 disabled:no-underline"
                >
                  Lihat Semua
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// --- App Utama ---
export default function App() {
  const sampleUser: User = {
    displayName: 'Grand Harmoni Indah',
    photoURL: 'https://placehold.co/100x100/0ea5e9/ffffff?text=BD',
  };

  const sampleStats: Stats = {
    totalIncome: 7550000,
    totalExpenses: 2125000,
    totalBills: 12,
    pendingBills: 3,
  };

  const sampleActivities: Activity[] = [
    {
      id: '1',
      type: 'income',
      user: 'PT. Maju Mundur',
      amount: 5000000,
      time: 'Hari ini, 13:45',
    },
    {
      id: '2',
      type: 'expense',
      user: 'Siti Nurbaya',
      amount: 75000,
      time: 'Hari ini, 11:20',
    },
    {
      id: '3',
      type: 'expense',
      user: 'Ahmad Yani',
      amount: 150000,
      time: 'Kemarin, 09:30',
    },
    {
      id: '4',
      type: 'income',
      user: 'Proyek Desain Logo',
      amount: 2550000,
      time: 'Kemarin, 19:00',
    },
  ];

  return (
    <DashboardPage
      user={sampleUser}
      stats={sampleStats}
      activities={sampleActivities}
    />
  );
}
