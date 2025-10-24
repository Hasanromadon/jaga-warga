import {
  FilePlus2,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  PlusCircle,
} from "lucide-react";
import React, { useState } from "react";
import AddBillForm from "./AddBillForm";
import ResidentList from "./ResidentList";
import AddFinanceRecordForm from "./AddFinanceRecordForm";
import FinanceList from "./FinanceList";
import { useDashboardStats, useActivities } from "@/hooks/useDashboard";

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

type ActivityType = "income" | "expense";

interface Activity {
  id: string;
  type: ActivityType;
  user: string;
  amount: number;
  time: string;
}

const formatRupiah = (number: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

// --- Tambahan type untuk view ---
type ViewType =
  | "dashboard"
  | "tagihan"
  | "warga"
  | "keuangan"
  | "catat-keuangan";

// --- Komponen Fast Menu ---
interface FastMenuProps {
  onSelect: (menu: ViewType) => void;
}
const FastMenu: React.FC<FastMenuProps> = ({ onSelect }) => {
  const menus: {
    id: number;
    key: ViewType;
    title: string;
    icon: React.ReactNode;
    bg: string;
  }[] = [
    {
      id: 1,
      key: "tagihan",
      title: "Tambah Tagihan",
      icon: <FilePlus2 className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      id: 2,
      key: "warga",
      title: "List Warga",
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-100",
    },
    {
      id: 3,
      key: "keuangan",
      title: "Keuangan",
      icon: <Wallet className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-100",
    },
    {
      id: 4,
      key: "catat-keuangan",
      title: "Catat Keuangan",
      icon: <PlusCircle className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="bg-white rounded-2xl ">
      <div className="flex items-center justify-between gap-2">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => onSelect(menu.key)}
            className="flex flex-col items-center justify-between flex-1 p-2 rounded-xl hover:bg-slate-100 active:scale-95 transition min-h-[90px]"
          >
            <div
              className={`w-11 h-11 rounded-md flex items-center justify-center ${menu.bg}`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {menu.icon}
              </div>
            </div>
            <div className="h-[28px] mt-2 flex items-center justify-center">
              <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight line-clamp-2">
                {menu.title}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Komponen StatCard ---
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: { bg: string; text: string };
}> = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg py-3 flex justify-between items-center gap-3">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${color.bg}`}
    >
      {icon}
    </div>
    <div className="min-w-0 items-center flex-1">
      <p className="text-xs text-slate-500 truncate">{title}</p>
      <p className="text-sm font-bold text-slate-800 break-words">{value}</p>
    </div>
  </div>
);

// --- Komponen Utama Dashboard ---
interface DashboardPageProps {
  user: User;
  stats: Stats;
  activities: Activity[];
}

function DashboardPage({ user }: DashboardPageProps) {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");

  const {
    data: stats = {
      totalIncome: 0,
      totalExpenses: 0,
      totalBills: 0,
      pendingBills: 0,
    },
  } = useDashboardStats();
  const { data: activities = [] } = useActivities();

  if (currentView === "tagihan") {
    return <AddBillForm onBack={() => setCurrentView("dashboard")} />;
  }
  if (currentView === "warga") {
    return <ResidentList onBack={() => setCurrentView("dashboard")} />;
  }
  if (currentView === "keuangan") {
    return <FinanceList onBack={() => setCurrentView("dashboard")} />;
  }
  if (currentView === "catat-keuangan") {
    return <AddFinanceRecordForm onBack={() => setCurrentView("dashboard")} />;
  }

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
                  color={{ bg: "bg-green-100", text: "text-green-600" }}
                />
              </div>

              <div className="w-px h-16 bg-slate-100 mx-2" />

              <div className="flex-1 flex items-center">
                <StatCard
                  title="Pengeluaran"
                  value={formatRupiah(stats.totalExpenses)}
                  icon={<TrendingDown className="w-5 h-5 text-red-500" />}
                  color={{ bg: "bg-red-100", text: "text-red-600" }}
                />
              </div>
            </div>
            <div className="w-full h-px bg-slate-100 mx-2 mb-3" />
            <FastMenu onSelect={setCurrentView} />
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
                          activity.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                        } rounded-full flex items-center justify-center flex-shrink-0`}
                      >
                        {activity.type === "income" ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800 break-words">
                          <span className="font-semibold">
                            {activity.type === "income"
                              ? "Pemasukkan"
                              : "Pengeluaran"}
                          </span>{" "}
                          <br />
                          {activity.user}
                        </p>
                        <p className="text-xs text-slate-400">
                          {activity.time}
                        </p>
                      </div>
                      <p
                        className={`text-sm font-semibold whitespace-nowrap text-right ${
                          activity.type === "income"
                            ? "text-green-600"
                            : "text-slate-700"
                        }`}
                      >
                        {activity.type === "income" ? "+" : ""}
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
    displayName: "Grand Harmoni Indah",
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
      id: "1",
      type: "income",
      user: "PT. Maju Mundur",
      amount: 5000000,
      time: "Hari ini, 13:45",
    },
    {
      id: "2",
      type: "expense",
      user: "Siti Nurbaya",
      amount: 75000,
      time: "Hari ini, 11:20",
    },
    {
      id: "3",
      type: "expense",
      user: "Ahmad Yani",
      amount: 150000,
      time: "Kemarin, 09:30",
    },
    {
      id: "4",
      type: "income",
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
