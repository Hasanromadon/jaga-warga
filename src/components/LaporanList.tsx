"use client";
import { getMonthName } from "@/utils/formatDate";
import { makeWaUrl } from "@/utils/formatPhone";
import { Calendar, FileDown, Filter, Search } from "lucide-react";
import { useState } from "react";
import { BULAN_LIST, STATUS_OPTIONS } from "../constants";
import { Bill } from "../types/bill";
import { EmptyBillIllustration } from "./svg/EmptyBillIllustration";
import { WhatsAppIcon } from "./svg/WhatsappIcon";
import { Button } from "./ui/button";
import { PreviewImageModal } from "./ui/PreviewImageModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const STATUS_LABELS: Record<string, string> = {
  unpaid: "Belum Lunas",
  pending: "Verifikasi",
  paid: "Lunas",
  approved: "Disetujui",
  rejected: "Ditolak",
};

// 🧠 Update filter function: tambahkan filter bulan
function filterBills(
  bills: Bill[],
  search: string,
  status: string,
  month: string
) {
  let filtered = bills;

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((bill) => {
      return (
        (bill.block || "").toLowerCase().includes(q) ||
        (bill.houseNumber || "").toLowerCase().includes(q) ||
        (bill.month || "").toLowerCase().includes(q) ||
        (bill.year || "").toLowerCase().includes(q) ||
        (bill.remark || "").toLowerCase().includes(q)
      );
    });
  }

  if (status && status !== "all") {
    filtered = filtered.filter((bill) => bill.status === status);
  }

  if (month && month !== "all") {
    filtered = filtered.filter((bill) => bill.month === month);
  }

  return filtered;
}

function formatRupiah(amount: number) {
  return amount
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
    .replace(/,00$/, "");
}

export default function LaporanList({ bills = [] }: { bills: Bill[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [month, setMonth] = useState("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredBills = filterBills(bills, search, status, month);

  const handleExport = () => {
    try {
      const header = [
        "Block",
        "House Number",
        "Month",
        "Year",
        "Amount",
        "Status",
        "Remark",
      ];
      const rows = filteredBills.map((b) => [
        b.block,
        b.houseNumber,
        b.month,
        b.year,
        formatRupiah(Number(b.amount)),
        b.status,
        (b.remark ?? "").replace(/"/g, '""'),
      ]);
      if (rows.length === 0) {
        alert("Tidak ada data untuk diekspor!");
        return;
      }
      const csv = [header, ...rows]
        .map((row) =>
          row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
        )
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
      console.error("CSV Export Error:", err);
      alert(
        "Gagal mengekspor CSV: " +
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* 🔹 Row 1: Search, Filter, Export */}
      <div className="flex flex-wrap items-center gap-1 w-full pb-1">
        {/* 🔍 Search Input */}
        <div className="relative flex-1 min-w-[200px] sm:min-w-[280px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari laporan..."
            className="w-full transition-all duration-200 bg-white border border-blue-200 rounded-md pl-9 pr-3 py-2 text-sm placeholder:text-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
        </div>

        {/* 🔽 Filter Status */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-14 h-12 p-0 flex items-center justify-center bg-white rounded-md hover:bg-blue-50">
            <Filter className="w-4 h-4 text-blue-800" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 📤 Export */}
        <div className="p-0 flex items-center justify-center bg-white rounded-md hover:bg-blue-50">
          <Button
            onClick={handleExport}
            variant="ghost"
            size="icon"
            className="text-blue-800 hover:bg-blue-50"
            title="Ekspor CSV"
          >
            <FileDown className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 🔹 Row 2: Filter Bulan */}
      <div className="flex items-center flex-row justify-between gap-2 mt-1">
        <span className="text-sm font-medium text-blue-900 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          Bulan
        </span>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="bg-white w-[140px] border border-blue-200">
            <SelectValue placeholder="Pilih Bulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Bulan</SelectItem>
            {BULAN_LIST.map((b) => (
              <SelectItem key={b.value} value={b.value}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List Section */}
      <div className="space-y-2">
        {filteredBills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-blue-700">
            <EmptyBillIllustration />
            <div className="mt-4 text-base font-semibold">
              Tidak ada data laporan.
            </div>
          </div>
        ) : (
          <>
            {filteredBills.map((bill) => (
              <div
                key={bill.id}
                className="p-0 bg-white rounded-xl shadow-sm border border-blue-100 relative overflow-visible transition hover:shadow-md active:scale-[0.98] cursor-pointer group"
              >
                <div className="px-4 pt-3 pb-2">
                  <div className="flex flex-wrap gap-2 justify-between items-center w-full mb-3">
                    <div className="flex flex-col space-y-1">
                      <div className="flex flex-row space-x-2">
                        <span className="text-sm font-bold truncate block max-w-[100px]">
                          {bill.residentName}
                        </span>
                        <span className="bg-blue-50 text-blue-700 rounded px-2 items-center flex text-xs font-normal border border-blue-100">
                          Blok {bill.block} No {bill.houseNumber}
                        </span>
                      </div>
                      <span className="inline-flex bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0">
                        {getMonthName(bill.month)} {bill.year}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span
                        className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full border select-none
                        ${
                          bill.status === "paid"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : bill.status === "pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : bill.status === "approved"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : bill.status === "rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {STATUS_LABELS[bill.status] || bill.status}
                      </span>

                      <span className="inline-flex items-center">
                        {bill.status === "unpaid" &&
                          (() => {
                            const waUrl = makeWaUrl(bill);
                            return waUrl ? (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                                title="Kirim pengingat via WhatsApp"
                              >
                                <WhatsAppIcon className="w-4 h-4" />
                                <span>WhatsApp</span>
                              </a>
                            ) : (
                              <span className="text-[8px] text-gray-400">
                                No. WA tidak tersedia
                              </span>
                            );
                          })()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm mb-1">
                    <span className="text-gray-700">Jumlah:</span>
                    <span className="font-bold text-blue-700 text-base">
                      {formatRupiah(Number(bill.amount))}
                    </span>
                  </div>

                  {(bill.status === "paid" || bill.status === "approved") &&
                    bill.proofUrl && (
                      <button
                        type="button"
                        className="text-xs text-blue-600 underline hover:text-blue-800 mt-1"
                        onClick={() => setPreviewImage(bill.proofUrl || null)}
                      >
                        🔗 Lihat Bukti Pembayaran
                      </button>
                    )}

                  {bill.remark && (
                    <div className="text-xs text-gray-500 mt-1">
                      Catatan: {bill.remark}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <PreviewImageModal
              open={!!previewImage}
              src={previewImage}
              onClose={() => setPreviewImage(null)}
            />
          </>
        )}
      </div>
    </div>
  );
}
