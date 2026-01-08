'use client';

import React from 'react';
import {
  FilePlus2,
  Users,
  Wallet,
  PlusCircle,
  Megaphone,
  ShoppingBag,
  BarChart3,
  CheckCircle,
} from 'lucide-react';

// --- Tambahan type untuk view ---
export type ViewType =
  | 'dashboard'
  | 'tagihan'
  | 'warga'
  | 'keuangan'
  | 'catat-keuangan'
  | 'buat-iklan'
  | 'promo'
  | 'laporan'
  | 'konfirmasi';

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
    gradient: string;
  }[] = [
    {
      id: 1,
      key: 'tagihan',
      title: 'Tambah Tagihan',
      icon: <FilePlus2 className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 hover:bg-blue-100',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      id: 2,
      key: 'warga',
      title: 'Data Warga',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 hover:bg-emerald-100',
      gradient: 'from-emerald-400 to-emerald-600',
    },
    {
      id: 3,
      key: 'keuangan',
      title: 'Keuangan',
      icon: <Wallet className="w-5 h-5 text-orange-600" />,
      bg: 'bg-orange-50 hover:bg-orange-100',
      gradient: 'from-orange-400 to-orange-600',
    },
    {
      id: 4,
      key: 'laporan',
      title: 'Laporan',
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 hover:bg-purple-100',
      gradient: 'from-purple-400 to-purple-600',
    },
    {
      id: 5,
      key: 'konfirmasi',
      title: 'Konfirmasi',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      bg: 'bg-green-50 hover:bg-green-100',
      gradient: 'from-green-400 to-green-600',
    },
    {
      id: 6,
      key: 'buat-iklan',
      title: 'Buat Iklan',
      icon: <Megaphone className="w-5 h-5 text-pink-600" />,
      bg: 'bg-pink-50 hover:bg-pink-100',
      gradient: 'from-pink-400 to-pink-600',
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-3">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => onSelect(menu.key)}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-200 active:scale-95 hover:scale-105 hover:shadow-lg ${menu.bg} border border-white/50 backdrop-blur-sm`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br ${menu.gradient} text-white`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {menu.icon}
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-700 text-center leading-tight">
              {menu.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FastMenu;
