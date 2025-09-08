"use client";

import { useAuthContext } from '../../context/AuthProvider';
import BillsList from '../../components/BillsList';
import ConfirmBillList from '../../components/ConfirmBillList';
import AddBillForm from '../../components/AddBillForm';
import ResidentList from '../../components/ResidentList';
import LaporanList from '../../components/LaporanList';
import { Tabs, TabsContent } from '../../components/ui/tabs';
import { BadgeCheck, PlusCircle, Users, Clock } from 'lucide-react';
import { useState } from 'react';
import { useBills } from '../../hooks/useBills';

export default function DashboardPage() {
  const { user, role } = useAuthContext();
  const [tab, setTab] = useState('konfirmasi');

  // if (role !== 'admin') {
  //   return (
  //     <main className="p-4 max-w-sm mx-auto">
  //       <h1 className="text-xl font-bold mb-4">Dashboard</h1>
  //       <h2 className="mb-2 font-semibold">Tagihan Saya</h2>
  //       <BillsList userId={user?.uid} />
  //     </main>
  //   );
  // }

  // Dummy pending count for badge (should be from backend in real app)
  const pendingCount = 2;
  // Get all bills for laporan tab (admin only)
  const { data: allBills = [], isLoading: loadingBills, error: errorBills } = useBills();
  const tabs = [
    {
      key: 'konfirmasi',
      label: 'Konfirmasi',
      icon: BadgeCheck,
      content: <ConfirmBillList />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      key: 'tambah',
      label: 'Tambah',
      icon: PlusCircle,
      content: <AddBillForm />,
    },
    {
      key: 'warga',
      label: 'Warga',
      icon: Users,
      content: <ResidentList />,
    },
    {
      key: 'laporan',
      label: 'Laporan',
      icon: Clock,
      content: (
        <>
          {loadingBills ? (
            <div className="text-center text-blue-700 py-8">Memuat data laporan...</div>
          ) : errorBills ? (
            <div className="text-center text-red-600 py-8">Gagal memuat data laporan</div>
          ) : (
            <LaporanList bills={allBills} />
          )}
        </>
      ),
    },
  ];
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-sm pb-20">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          {tabs.map(t => (
            <TabsContent key={t.key} value={t.key}>
              {t.content}
            </TabsContent>
          ))}
        </Tabs>
        {/* Bottom Navigation Floating Tab */}
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-2">
          <div className="flex justify-between bg-white/95 shadow-xl rounded-xl border border-blue-100 overflow-hidden backdrop-blur supports-[backdrop-filter]:bg-white/80 animate-fade-in">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`group flex-1 flex flex-col items-center py-1.5 px-1 transition-all duration-200 border-b-2 ${tab===t.key ? 'text-blue-700 border-blue-600 font-bold bg-blue-50/60' : 'text-blue-900 border-transparent hover:bg-blue-50/40'}`}
                  style={{ minWidth: 0 }}
                >
                  <span className="relative">
                    <Icon className={`w-6 h-6 mb-0.5 transition-transform duration-200 ${tab===t.key ? 'scale-110' : 'opacity-70 group-hover:scale-105'}`} />
                    {t.badge && (
                      <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center border border-white shadow">{t.badge}</span>
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
