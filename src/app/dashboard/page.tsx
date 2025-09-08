"use client";

import { useAuthContext } from '../../context/AuthProvider';
import BillsList from '../../components/BillsList';
import ConfirmBillList from '../../components/ConfirmBillList';
import AddBillForm from '../../components/AddBillForm';
import ResidentForm from '../../components/ResidentForm';
import HistoryList from '../../components/HistoryList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { BadgeCheck, PlusCircle, Users, Clock } from 'lucide-react';
import { useMemo } from 'react';
import Image from 'next/image';
import { useState } from 'react';

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
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-sm pb-20">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsContent value="konfirmasi">
            <ConfirmBillList />
          </TabsContent>
          <TabsContent value="tambah">
            <AddBillForm />
          </TabsContent>
          <TabsContent value="warga">
            <ResidentForm onSave={() => {}} />
          </TabsContent>
          <TabsContent value="history">
            <h2 className="font-semibold mb-2 text-blue-900 flex items-center gap-2"><Clock className="w-4 h-4" />History Pembayaran</h2>
            {/* TODO: List history pembayaran warga, bisa filter per user/alamat */}
            <HistoryList bills={[]} />
          </TabsContent>
        </Tabs>
        {/* Bottom Navigation Floating Tab */}
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-2">
          <div className="flex justify-between bg-white/95 shadow-xl rounded-xl border border-blue-100 overflow-hidden backdrop-blur supports-[backdrop-filter]:bg-white/80 animate-fade-in">
            <button
              onClick={() => setTab('konfirmasi')}
              className={`group flex-1 flex flex-col items-center py-1.5 px-1 transition-all duration-200 border-b-2 ${tab==='konfirmasi' ? 'text-blue-700 border-blue-600 font-bold bg-blue-50/60' : 'text-blue-900 border-transparent hover:bg-blue-50/40'}`}
              style={{ minWidth: 0 }}
            >
              <span className="relative">
                <BadgeCheck className={`w-6 h-6 mb-0.5 transition-transform duration-200 ${tab==='konfirmasi' ? 'scale-110' : 'opacity-70 group-hover:scale-105'}`} />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center border border-white shadow">{pendingCount}</span>
                )}
              </span>
              <span className="text-xs leading-tight">Konfirmasi</span>
            </button>
            <button
              onClick={() => setTab('tambah')}
              className={`group flex-1 flex flex-col items-center py-1.5 px-1 transition-all duration-200 border-b-2 ${tab==='tambah' ? 'text-blue-700 border-blue-600 font-bold bg-blue-50/60' : 'text-blue-900 border-transparent hover:bg-blue-50/40'}`}
              style={{ minWidth: 0 }}
            >
              <PlusCircle className={`w-6 h-6 mb-0.5 transition-transform duration-200 ${tab==='tambah' ? 'scale-110' : 'opacity-70 group-hover:scale-105'}`} />
              <span className="text-xs leading-tight">Tambah</span>
            </button>
            <button
              onClick={() => setTab('warga')}
              className={`group flex-1 flex flex-col items-center py-1.5 px-1 transition-all duration-200 border-b-2 ${tab==='warga' ? 'text-blue-700 border-blue-600 font-bold bg-blue-50/60' : 'text-blue-900 border-transparent hover:bg-blue-50/40'}`}
              style={{ minWidth: 0 }}
            >
              <Users className={`w-6 h-6 mb-0.5 transition-transform duration-200 ${tab==='warga' ? 'scale-110' : 'opacity-70 group-hover:scale-105'}`} />
              <span className="text-xs leading-tight">Warga</span>
            </button>
            <button
              onClick={() => setTab('history')}
              className={`group flex-1 flex flex-col items-center py-1.5 px-1 transition-all duration-200 border-b-2 ${tab==='history' ? 'text-blue-700 border-blue-600 font-bold bg-blue-50/60' : 'text-blue-900 border-transparent hover:bg-blue-50/40'}`}
              style={{ minWidth: 0 }}
            >
              <Clock className={`w-6 h-6 mb-0.5 transition-transform duration-200 ${tab==='history' ? 'scale-110' : 'opacity-70 group-hover:scale-105'}`} />
              <span className="text-xs leading-tight">History</span>
            </button>
          </div>
        </nav>
      </div>
      <footer className="mt-10 text-xs text-blue-900/60 text-center">
        &copy; {new Date().getFullYear()} IPL Perumahan. All rights reserved.
      </footer>
    </main>
  );
}
