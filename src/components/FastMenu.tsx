'use client';

import React from 'react';
import {
  FilePlus2,
  Users,
  Wallet,
  PlusCircle,
  Megaphone,
  ShoppingBag,
} from 'lucide-react';

// --- Tambahan type untuk view ---
export type ViewType =
  | 'dashboard'
  | 'tagihan'
  | 'warga'
  | 'keuangan'
  | 'catat-keuangan'
  | 'buat-iklan'
  | 'promo';

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
      key: 'tagihan',
      title: 'Tambah Tagihan',
      icon: <FilePlus2 className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-100',
    },
    {
      id: 2,
      key: 'warga',
      title: 'Data Warga',
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-100',
    },
    {
      id: 3,
      key: 'keuangan',
      title: 'Keuangan',
      icon: <Wallet className="w-5 h-5 text-orange-600" />,
      bg: 'bg-orange-100',
    },
    {
      id: 4,
      key: 'buat-iklan',
      title: 'Buat Iklan',
      icon: <Megaphone className="w-5 h-5 text-pink-600" />,
      bg: 'bg-pink-100',
    },
    {
      id: 5,
      key: 'promo',
      title: 'Promosi Warga',
      icon: <ShoppingBag className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-100',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-2 shadow-sm">
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

export default FastMenu;
