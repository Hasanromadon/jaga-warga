"use client";

import ConfirmBillList from "../../components/ConfirmBillList";
import AddBillForm from "../../components/AddBillForm";
import AddFinanceRecordForm from "../../components/AddFinanceRecordForm";
import FinanceList from "../../components/FinanceList";
import { useAuthContext } from "../../context/AuthProvider";
// import AddBillForm from "../../components/AddBillForm";
import DashboardPage from "@/components/DashboardPage";
import { LogOut, User } from "lucide-react";
import LaporanList from "../../components/LaporanList";
import { Button } from "../../components/ui/button";
import { useBills } from "../../hooks/useBills";
import { Bill } from "../../types/bill";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import ResidentList from "@/components/ResidentList";
import RequireAuth from "@/components/RequireAuth";

// Dual-tone SVG icons for bottom navigation
const DualToneDashboard = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={active ? "#3973C4" : "#E0EDFF"} />
    <rect
      x="7"
      y="7"
      width="10"
      height="6"
      rx="1"
      fill={active ? "#fff" : "#3973C4"}
    />
    <rect
      x="9"
      y="9"
      width="2"
      height="2"
      rx="1"
      fill={active ? "#3973C4" : "#E0EDFF"}
    />
    <rect
      x="13"
      y="9"
      width="2"
      height="2"
      rx="1"
      fill={active ? "#3973C4" : "#E0EDFF"}
    />
  </svg>
);
const DualToneBadgeCheck = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={active ? "#3973C4" : "#E0EDFF"} />
    <path
      d="M8 12.5l2.5 2.5 5-5"
      stroke={active ? "#fff" : "#3973C4"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const DualToneUsers = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="10" rx="4" ry="4" fill={"#3973C4"} />
    <ellipse cx="12" cy="18" rx="7" ry="3" fill={"#7BA7E7"} />
    <ellipse
      cx="7"
      cy="13"
      rx="2"
      ry="2"
      fill={active ? "#7BA7E7" : "#E0EDFF"}
    />
    <ellipse
      cx="17"
      cy="13"
      rx="2"
      ry="2"
      fill={active ? "#7BA7E7" : "#E0EDFF"}
    />
  </svg>
);
const DualToneClock = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={active ? "#3973C4" : "#E0EDFF"} />
    <rect
      x="11"
      y="7"
      width="2"
      height="6"
      rx="1"
      fill={active ? "#fff" : "#3973C4"}
    />
    <rect
      x="11"
      y="12"
      width="5"
      height="2"
      rx="1"
      fill={active ? "#fff" : "#3973C4"}
    />
  </svg>
);
const DualToneUser = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={active ? "#3973C4" : "#E0EDFF"} />
    <circle cx="12" cy="10" r="3" fill={active ? "#fff" : "#3973C4"} />
    <path
      d="M6 20c0-3.5 2.7-6.5 6-6.5s6 3 6 6.5"
      stroke={active ? "#fff" : "#3973C4"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

function AppPage() {
  const { user, role, signOut } = useAuthContext();
  const location = useLocation();

  // if (role !== 'admin') {
  //   return (
  //     <main className="p-4 max-w-sm mx-auto">
  //       <h1 className="text-xl font-bold mb-4">Dashboard</h1>
  //       <h2 className="mb-2 font-semibold">Tagihan Saya</h2>
  //       <BillsList userId={user?.uid} />
  //     </main>
  //   );
  // }

  // Get all bills for laporan tab (admin only)
  const {
    data: allBills = [],
    isLoading: loadingBills,
    error: errorBills,
  } = useBills();
  // Count pending bills for badge (from backend)
  const pendingCount = (allBills || []).filter(
    (bill: Bill) => bill.status === "pending"
  ).length;

  const tabs = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: DualToneDashboard,
      content: <DashboardPage />,
    },
    {
      key: "konfirmasi",
      label: "Konfirmasi",
      icon: DualToneBadgeCheck,
      content: <ConfirmBillList />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    // {
    //   key: "warga",
    //   label: "Warga",
    //   icon: DualToneUsers,
    //   content: <ResidentList />,
    // },
    {
      key: "laporan",
      label: "Laporan",
      icon: DualToneClock,
      content: (
        <>
          {loadingBills ? (
            <div className="text-center text-blue-700 py-8">
              Memuat data laporan...
            </div>
          ) : errorBills ? (
            <div className="text-center text-red-600 py-8">
              Gagal memuat data laporan
            </div>
          ) : (
            <LaporanList />
          )}
        </>
      ),
    },
    {
      key: "profil",
      label: "Profil",
      icon: DualToneUser,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-lg p-4 shadow-sm">
            <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-base font-medium text-blue-900">
                {user?.displayName || user?.email?.split("@")[0] || "Admin"}
              </p>
              <p className="text-sm text-blue-600 capitalize">{role}</p>
            </div>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      ),
    },
  ];
  return (
    <main className="min-h-screen flex flex-col items-center pb-10">
      <div className="w-full max-w-sm bg-gradient-to-b from-blue-100 to-white p-4 min-h-screen sm:border sm:rounded-md">
        <div className="w-full">
          <div className="min-h-[200px]">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/tagihan" element={<AddBillForm />} />
              <Route path="/dashboard/keuangan" element={<FinanceList />} />
              <Route
                path="/dashboard/catat-keuangan"
                element={<AddFinanceRecordForm />}
              />
              <Route
                path="/dashboard/konfirmasi"
                element={<ConfirmBillList />}
              />
              <Route path="/dashboard/warga" element={<ResidentList />} />
              <Route
                path="/dashboard/laporan"
                element={
                  loadingBills ? (
                    <div className="text-center text-blue-700 py-8">
                      Memuat data laporan...
                    </div>
                  ) : errorBills ? (
                    <div className="text-center text-red-600 py-8">
                      Gagal memuat data laporan
                    </div>
                  ) : (
                    <LaporanList />
                  )
                }
              />
              <Route
                path="/dashboard/profil"
                element={
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur rounded-lg p-4 shadow-sm">
                      <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-blue-900">
                          {user?.displayName ||
                            user?.email?.split("@")[0] ||
                            "Admin"}
                        </p>
                        <p className="text-sm text-blue-600 capitalize">
                          {role}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={signOut}
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Keluar
                    </Button>
                  </div>
                }
              />
              <Route path="*" element={<DashboardPage />} />
            </Routes>
          </div>
        </div>
        {/* Bottom Navigation Floating Tab - fixed, always at bottom, not affected by scroll */}
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-2"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
        >
          <div className="flex justify-between bg-white/95 shadow-xl rounded-xl border border-blue-100 overflow-hidden backdrop-blur supports-[backdrop-filter]:bg-white/80 animate-fade-in">
            {tabs.map((t) => {
              const Icon = t.icon;
              const to =
                t.key === "dashboard" ? "/dashboard" : `/dashboard/${t.key}`;
              return (
                <NavLink
                  key={t.key}
                  to={to}
                  className={({ isActive }) =>
                    `group flex-1 flex flex-col items-center py-1.5 px-1 transition-all duration-200 border-b-2 ${
                      isActive
                        ? "text-blue-700 border-blue-600 font-bold bg-blue-50/60"
                        : "text-blue-900 border-transparent hover:bg-blue-50/40"
                    }`
                  }
                  style={{ minWidth: 0 }}
                >
                  <span className="relative">
                    <Icon
                      active={
                        location.pathname.endsWith(t.key) ||
                        (t.key === "dashboard" &&
                          location.pathname === "/dashboard")
                      }
                    />
                    {t.badge && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center border border-white shadow">
                        {t.badge}
                      </span>
                    )}
                  </span>
                  <span className="text-xs leading-tight">{t.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
      {/* <footer className="mt-10 text-xs text-blue-900/60 text-center">
        &copy; {new Date().getFullYear()} IPL Perumahan. All rights reserved.
      </footer> */}
    </main>
  );
}

export default function Page() {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <AppPage />
    </RequireAuth>
  );
}
