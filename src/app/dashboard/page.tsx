"use client";

import { useAuthContext } from "../../context/AuthProvider";
import ConfirmBillList from "../../components/ConfirmBillList";
import AddBillForm from "../../components/AddBillForm";
import ResidentList from "../../components/ResidentList";
import LaporanList from "../../components/LaporanList";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { LogOut, User } from "lucide-react";
import { withProtectedRoute } from "../../utils/protectedRoute";
// Dual-tone SVG icons for bottom navigation
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
const DualTonePlusCircle = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={active ? "#3973C4" : "#E0EDFF"} />
    <rect
      x="11"
      y="7"
      width="2"
      height="10"
      rx="1"
      fill={active ? "#fff" : "#3973C4"}
    />
    <rect
      x="7"
      y="11"
      width="10"
      height="2"
      rx="1"
      fill={active ? "#fff" : "#3973C4"}
    />
  </svg>
);
const DualToneUsers = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <ellipse
      cx="12"
      cy="10"
      rx="4"
      ry="4"
      fill={active ? "#3973C4" : "#E0EDFF"}
    />
    <ellipse
      cx="12"
      cy="18"
      rx="7"
      ry="3"
      fill={active ? "#7BA7E7" : "#E0EDFF"}
    />
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
import { useState } from "react";
import { useBills } from "../../hooks/useBills";

function DashboardPage() {
  const { user, role, residentialId, signOut } = useAuthContext();
  const [tab, setTab] = useState("konfirmasi");

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
  } = useBills(residentialId ?? undefined);
  // Count pending bills for badge (from backend)
  const pendingCount = (allBills || []).filter(
    (bill: import("../../types/bill").Bill) => bill.status === "pending"
  ).length;
  const tabs = [
    {
      key: "konfirmasi",
      label: "Konfirmasi",
      icon: DualToneBadgeCheck,
      content: <ConfirmBillList />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      key: "tambah",
      label: "Tambah",
      icon: DualTonePlusCircle,
      content: <AddBillForm />,
    },
    {
      key: "warga",
      label: "Warga",
      icon: DualToneUsers,
      content: <ResidentList />,
    },
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
            <LaporanList bills={allBills} />
          )}
        </>
      ),
    },
  ];
  return (
    <main className="min-h-screen flex flex-col items-center pb-24">
      <div className="w-full max-w-sm bg-gradient-to-b from-blue-100 to-white p-4 min-h-screen sm:border sm:rounded-md">
        {/* Header with user info and logout */}
        <div className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                {user?.displayName || user?.email?.split("@")[0] || "Admin"}
              </p>
              <p className="text-xs text-blue-600 capitalize">{role}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          {tabs.map((t) => (
            <TabsContent key={t.key} value={t.key}>
              {t.content}
            </TabsContent>
          ))}
        </Tabs>
        {/* Bottom Navigation Floating Tab - fixed, always at bottom, not affected by scroll */}
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-2"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
        >
          <div className="flex justify-between bg-white/95 shadow-xl rounded-xl border border-blue-100 overflow-hidden backdrop-blur supports-[backdrop-filter]:bg-white/80 animate-fade-in">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`group flex-1 flex flex-col items-center py-1.5 px-1 transition-all duration-200 border-b-2 ${
                    tab === t.key
                      ? "text-blue-700 border-blue-600 font-bold bg-blue-50/60"
                      : "text-blue-900 border-transparent hover:bg-blue-50/40"
                  }`}
                  style={{ minWidth: 0 }}
                >
                  <span className="relative">
                    <Icon active={tab === t.key} />
                    {t.badge && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center border border-white shadow">
                        {t.badge}
                      </span>
                    )}
                  </span>
                  <span className="text-xs leading-tight">{t.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
      <footer className="mt-10 text-xs text-blue-900/60 text-center">
        &copy; {new Date().getFullYear()} IPL Perumahan. All rights reserved.
      </footer>
    </main>
  );
}

export default withProtectedRoute(DashboardPage, ["admin"]);
