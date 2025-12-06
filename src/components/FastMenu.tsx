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
    <div className="w-full">
      <div className="grid grid-cols-4 gap-y-4 gap-x-2">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => onSelect(menu.key)}
            className="flex flex-col items-center justify-start gap-2 p-1 hover:bg-slate-50 rounded-xl transition active:scale-95"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${menu.bg}`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {menu.icon}
              </div>
            </div>
            <span className="text-[10px] font-medium text-slate-600 text-center leading-tight w-full px-1">
              {menu.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FastMenu;
