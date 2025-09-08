"use client";
import { Bill } from '../types/bill';

export default function HistoryList({ bills }: { bills: Bill[] }) {
  if (!bills || bills.length === 0) return <div className="text-center text-sm text-blue-700">Belum ada riwayat pembayaran.</div>;
  return (
    <div className="space-y-2">
      {bills.map((bill) => (
        <div key={bill.id} className="p-3 bg-white rounded shadow flex flex-col border border-blue-50">
          <span className="text-xs text-blue-900 font-semibold">{bill.bulan}/{bill.tahun}</span>
          <span className="text-sm">Nominal: <span className="text-blue-700 font-bold">Rp{bill.nominal}</span></span>
          <span className="text-xs">Status: <span className={bill.status === 'lunas' ? 'text-green-600' : bill.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}>{bill.status}</span></span>
        </div>
      ))}
    </div>
  );
}
