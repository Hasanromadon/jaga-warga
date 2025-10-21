import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

// --- Definisi Tipe & Helper ---

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

type ActivityType = "paid" | "new" | "pending";

interface Activity {
  id: number;
  type: ActivityType;
  user: string;
  amount: number;
  time: string;
}

const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

// --- Komponen-Komponen UI Kecil (Building Blocks) ---

interface IconProps {
  className?: string;
}

const CheckBadgeIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ChartBarIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const PlusIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: { bg: string; text: string };
}> = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg px-2 py-4 shadow-sm border border-slate-200/50 flex items-start gap-3">
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${color.bg}`}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-slate-500 truncate">{title}</p>
      <p className="text-sm font-bold text-slate-800 break-words">{value}</p>
    </div>
  </div>
);

// --- Komponen Halaman Dasbor ---

interface DashboardPageProps {
  user: User;
  stats: Stats;
  activities: Activity[];
}

function DashboardPage({ user, stats, activities }: DashboardPageProps) {
  return (
    <div className="min-h-screen  font-sans text-slate-800">
      <main className="w-full max-w-md mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <header className="flex items-center gap-4">
            <div>
              <p className="text-base text-slate-500">Selamat Sore,</p>
              <h1 className="text-2xl font-bold text-slate-900">
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

          {/* Grid Statistik */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard
              title="Pemasukan"
              value={formatRupiah(stats.totalIncome)}
              icon={<TrendingUp className="w-3 h-3 text-green-500" />}
              color={{ bg: "bg-green-100", text: "text-green-600" }}
            />
            <StatCard
              title="Pengeluaran"
              value={formatRupiah(stats.totalExpenses)}
              icon={<TrendingDown className="w-3 h-3 text-red-500" />}
              color={{ bg: "bg-red-100", text: "text-red-600" }}
            />
          </div>

          {/* Aktivitas Terbaru */}
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Aktivitas Terbaru
            </h2>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/50">
              <div className="divide-y divide-slate-100">
                {activities.length > 0 ? (
                  activities.map((activity) => {
                    const icons: Record<ActivityType, React.ReactElement> = {
                      paid: (
                        <CheckBadgeIcon className="w-5 h-5 text-green-500" />
                      ),
                      new: <PlusIcon className="w-5 h-5 text-blue-500" />,
                      pending: (
                        <ChartBarIcon className="w-5 h-5 text-amber-500" />
                      ),
                    };
                    const texts: Record<ActivityType, string> = {
                      paid: "Pembayaran dari",
                      new: "Tagihan untuk",
                      pending: "Menunggu dari",
                    };
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3 py-3"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {icons[activity.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-800 break-words">
                            <span className="font-semibold">
                              {texts[activity.type]}
                            </span>{" "}
                            {activity.user}
                          </p>
                          <p className="text-xs text-slate-400">
                            {activity.time}
                          </p>
                        </div>
                        <p
                          className={`text-sm font-semibold whitespace-nowrap text-right ${
                            activity.type === "paid"
                              ? "text-green-600"
                              : "text-slate-700"
                          }`}
                        >
                          {activity.type === "paid" ? "+" : ""}
                          {formatRupiah(activity.amount)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-sm text-slate-500 py-4">
                    Belum ada aktivitas.
                  </p>
                )}
              </div>
              {activities.length > 0 && (
                <button className="w-full text-center text-sm font-semibold text-blue-600 mt-4 pt-3 border-t border-slate-100 hover:underline disabled:text-slate-400 disabled:no-underline">
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

// --- Komponen App Utama untuk Menampilkan Dasbor ---

export default function App() {
  // Data contoh untuk ditampilkan di UI
  const sampleUser: User = {
    displayName: "Budi Doremi",
    photoURL: "https://placehold.co/100x100/0ea5e9/ffffff?text=BD",
  };

  const sampleStats: Stats = {
    totalIncome: 7550000,
    totalExpenses: 2125000,
    totalBills: 12,
    pendingBills: 3,
  };

  const sampleActivities: Activity[] = [
    {
      id: 1,
      type: "paid",
      user: "PT. Maju Mundur",
      amount: 5000000,
      time: "Hari ini, 13:45",
    },
    {
      id: 2,
      type: "new",
      user: "Siti Nurbaya",
      amount: 75000,
      time: "Hari ini, 11:20",
    },
    {
      id: 3,
      type: "pending",
      user: "Ahmad Yani",
      amount: 150000,
      time: "Kemarin, 09:30",
    },
    {
      id: 4,
      type: "paid",
      user: "Proyek Desain Logo",
      amount: 2550000,
      time: "Kemarin, 19:00",
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
