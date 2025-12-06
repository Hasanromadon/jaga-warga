import React from 'react';
import { Calendar, FileDown, MessageSquare, Check } from 'lucide-react';
import { Bill } from '@/types/bill';
import { getMonthName } from '@/utils/formatDate';
import { formatRupiah } from '@/utils/formatRupiah';
import { STATUS_LABELS } from '@/constants';

// Tipe dan Properti tetap sama
type BillStatus = 'paid' | 'approved' | 'pending' | 'rejected' | 'unpaid';

interface BillCardProps {
  bill: Bill;
  onStatusChange: (bill: Bill, newStatus: BillStatus) => void;
  onShowProof: (url: string) => void;
  onSendWhatsApp: (bill: Bill) => void;
}

// Konfigurasi style yang disederhanakan untuk mobile
const STATUS_CONFIG: Record<BillStatus, { badge: string; text: string }> = {
  paid: {
    badge:
      'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    text: 'text-green-600',
  },
  approved: {
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    text: 'text-blue-600',
  },
  pending: {
    badge:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    text: 'text-yellow-600',
  },
  rejected: {
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    text: 'text-red-600',
  },
  unpaid: {
    badge:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
    text: 'text-orange-600',
  },
};

export const BillCard: React.FC<BillCardProps> = ({
  bill,
  onStatusChange,
  onShowProof,
  onSendWhatsApp,
}) => {
  const statusInfo = STATUS_CONFIG[bill.status];

  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md ">
      {/* Bagian Header: Info Utama & Status */}
      <div className="flex items-start justify-between p-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {bill.residentName || 'Nama Penghuni'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Blok {bill.block} No {bill.houseNumber}
          </p>
        </div>
        <span
          className={`ml-3 flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.badge}`}
        >
          {STATUS_LABELS[bill.status] || bill.status}
        </span>
      </div>

      {/* Garis Pemisah */}
      <div className="border-b border-gray-200 dark:border-gray-700" />

      {/* Bagian Konten: Periode & Jumlah */}
      <div className="px-3 py-2">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <Calendar size={16} />
            Periode Tagihan
          </span>
          <span>
            {getMonthName(bill.month)} {bill.year}
          </span>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Jumlah</p>
          <p className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {formatRupiah(Number(bill.amount))}
          </p>
        </div>
      </div>

      {/* Aksi Sekunder (jika ada) */}
      {(bill.proofUrl || bill.status === 'unpaid') && (
        <div className="flex justify-center gap-4 border-t border-gray-200 px-4 py-3 dark:border-gray-700">
          {bill.proofUrl && (
            <SecondaryButton onClick={() => onShowProof(bill.proofUrl!)}>
              <FileDown size={16} />
              Lihat Bukti
            </SecondaryButton>
          )}
          {bill.status === 'unpaid' && (
            <SecondaryButton onClick={() => onSendWhatsApp(bill)}>
              <MessageSquare size={16} />
              Kirim Pengingat
            </SecondaryButton>
          )}
        </div>
      )}

      {/* Bagian Footer: Tombol Aksi Utama */}
      <div className="bg-gray-50 p-3 dark:bg-gray-800/50">
        {bill.status !== 'paid' && bill.status !== 'approved' && (
          <ActionButton
            onClick={() => onStatusChange(bill, 'paid')}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            <Check size={20} className="mr-2" />
            Tandai Lunas
          </ActionButton>
        )}
        {bill.status === 'paid' && (
          <ActionButton
            onClick={() => onStatusChange(bill, 'unpaid')}
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            Batalkan Pembayaran
          </ActionButton>
        )}
      </div>
    </div>
  );
};

// --- Helper Components untuk Tombol ---

const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => (
  <button
    {...props}
    className={`flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold shadow-sm transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

const SecondaryButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...props }) => (
  <button
    {...props}
    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
  >
    {children}
  </button>
);
