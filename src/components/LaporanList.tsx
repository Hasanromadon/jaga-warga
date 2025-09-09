"use client";
import React, { useState } from "react";
import { PreviewImageModal } from "./ui/PreviewImageModal";

import { Bill } from "../types/bill";
// import { useResidents, Resident } from '../hooks/useResidents';

import { EmptyBillIllustration } from "./svg/EmptyBillIllustration";
import { Filter, FileDown, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { STATUS_OPTIONS } from "../constants";

const STATUS_LABELS: Record<string, string> = {
  unpaid: "Belum Lunas",
  pending: "Menunggu Verifikasi",
  paid: "Lunas",
  approved: "Disetujui",
  rejected: "Ditolak",
};

function filterBills(bills: Bill[], search: string, status: string) {
  let filtered = bills;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((bill) => {
      return (
        (bill.block || '').toLowerCase().includes(q) ||
        (bill.houseNumber || '').toLowerCase().includes(q) ||
        (bill.month || '').toLowerCase().includes(q) ||
        (bill.year || '').toLowerCase().includes(q) ||
        (bill.remark || '').toLowerCase().includes(q)
      );
    });
  }
  if (status && status !== "all") {
    filtered = filtered.filter((bill) => bill.status === status);
  }
  return filtered;
}
function formatRupiah(amount: number) {
  return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).replace(/,00$/, '');
}


export default function LaporanList({ bills = [] }: { bills: Bill[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [searchActive, setSearchActive] = useState(false);
  const [previewImage, setPreviewImage] = useState<string|null>(null);
  const filteredBills = filterBills(bills, search, status);

  const handleExport = () => {
    try {
      // Improved CSV export: format amount, escape quotes, handle commas
      const header = ["Block", "House Number", "Month", "Year", "Amount", "Status", "Remark"];
      const rows = filteredBills.map((b) => [
        b.block,
        b.houseNumber,
        b.month,
        b.year,
        formatRupiah(Number(b.amount)),
        b.status,
        (b.remark ?? '').replace(/"/g, '""'),
      ]);
      console.log('Exporting CSV, rows:', rows.length, rows);
      if (rows.length === 0) {
        alert('Tidak ada data untuk diekspor!');
        return;
      }
      const csv = [header, ...rows]
        .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "laporan_warga.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('CSV Export Error:', err);
      alert('Gagal mengekspor CSV: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 w-full pb-1">
        <div className={`relative flex-1 transition-all duration-200 ${searchActive || search ? 'z-10' : ''}`}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchActive(true)}
            onBlur={() => setSearchActive(false)}
            placeholder="Cari laporan..."
            className={`peer transition-all duration-200 bg-white border border-blue-200 rounded-md pl-9 pr-3 py-2 text-sm placeholder:text-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none ${searchActive || search ? 'w-full shadow-md' : 'w-full'} `}
            // Responsive width handled by Tailwind classes only
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
        </div>
        {searchActive || search ? (
          <div className="flex gap-1 items-center">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-8 h-8 p-0 border-none outline-none bg-none ring-0 shadow-none focus:ring-0 focus-visible:ring-0 focus:border-none focus-visible:border-none data-[state=open]:ring-0 data-[state=open]:border-none flex items-center justify-center">
                <span className="sr-only">Status</span>
                <Filter className="w-5 h-5 text-neutral-950 -mr-2" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="ghost" size="icon" title="Export Laporan" className="p-2">
              <FileDown className="w-5 h-5" />
              <span className="sr-only">Ekspor</span>
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleExport} variant="outline" className="gap-1 text-sm">
              <FileDown className="w-4 h-4" /> Ekspor
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        {filteredBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-blue-700">
            <EmptyBillIllustration />
            <div className="mt-4 text-base font-semibold">Tidak ada data laporan.</div>
          </div>
        ) : (
          <>
            {filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="p-0 bg-white rounded-xl shadow-sm border border-blue-100 relative overflow-visible transition hover:shadow-md active:scale-[0.98] cursor-pointer group"
                tabIndex={0}
                aria-label={`Laporan Blok ${bill.block} No ${bill.houseNumber} bulan ${bill.month} ${bill.year}`}
              >
                <div className="px-4 pt-3 pb-2">
                  <div className="flex flex-wrap gap-2 items-center w-full mb-3">
                    <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-semibold">{bill.month}/{bill.year}</span>
                    <span className="bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-xs font-normal border border-blue-100">{bill.block}/{bill.houseNumber}</span>
                    <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full border select-none
                      ${bill.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : bill.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : bill.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' : bill.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{STATUS_LABELS[bill.status] || bill.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <span className="text-gray-700">Jumlah:</span>
                    <span className="font-bold text-blue-700 text-base">{formatRupiah(Number(bill.amount))}</span>
                  </div>
                  {(bill.status === 'paid' || bill.status === 'approved') && bill.proofUrl && (
                    <button
                      type="button"
                      className="text-xs text-blue-600 underline bg-transparent border-0 p-0 cursor-pointer hover:text-blue-800 mt-1"
                      onClick={() => setPreviewImage(bill.proofUrl || null)}
                    >
                      Lihat Bukti Pembayaran
                    </button>
                  )}
                  {bill.remark && (
                    <div className="text-xs text-gray-500 mt-1">Catatan: {bill.remark}</div>
                  )}
                </div>
              </div>
            ))}
            {/* Modal khusus untuk preview bukti bayar */}
            <PreviewImageModal open={!!previewImage} src={previewImage} onClose={() => setPreviewImage(null)} />
          </>
        )}
      </div>
    </div>
  );
}
