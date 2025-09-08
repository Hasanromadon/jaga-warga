import { BadgeCheck, UploadCloud, XCircle, Home, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { BULAN_LIST } from "../../constants";
import type { Bill } from "../../types";
import React from "react";

interface BillDetailProps {
  bill: Bill;
  uploading: boolean;
  bukti: File | null;
  setBukti: (file: File | null) => void;
  handleUpload: () => void;
}

export function BillDetail({ bill, uploading, bukti, setBukti, handleUpload }: BillDetailProps) {
  return (
    <div className="rounded-2xl bg-white/90 border border-blue-100  p-5 flex flex-col gap-3 transition-all duration-200 hover:shadow-blue-200/60 animate-fade-in">
      {/* Nama dan alamat */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-100 p-2 flex items-center justify-center self-start mt-1"><Home className="w-5 h-5 text-blue-600" /></div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="font-bold text-blue-900 text-lg leading-snug break-words whitespace-pre-line mb-0.5">{bill.nama}</div>
          <div className="text-xs text-blue-500 font-medium leading-tight">{bill.blokRumah}/{bill.nomorRumah}</div>
        </div>
      </div>
      {/* Nominal */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="text-[13px] text-blue-400 font-medium">Nominal Tagihan</div>
        <div className="text-blue-700 font-extrabold text-2xl tabular-nums leading-tight tracking-tight text-center">{Number(bill.nominal).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</div>
      </div>
      {/* Divider */}
      <hr className="my-1 border-blue-100" />
      {/* Tanggal & Status */}
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[12px] text-blue-400 font-medium">Periode</span>
          <span className="text-blue-700 font-semibold text-sm">{BULAN_LIST.find((b: { value: string; label: string }) => b.value === bill.bulan)?.label}/{bill.tahun}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[12px] text-blue-400 font-medium">Status</span>
          {bill.status === "lunas" ? (
            <span className="flex items-center gap-1 text-green-600 text-xs font-semibold"><BadgeCheck className="w-4 h-4" /> Lunas</span>
          ) : bill.status === "pending" ? (
            <span className="flex items-center gap-1 text-yellow-600 text-xs font-semibold"><UploadCloud className="w-4 h-4" /> Menunggu Verifikasi</span>
          ) : (
            <span className="flex items-center gap-1 text-red-600 text-xs font-semibold"><XCircle className="w-4 h-4" /> Belum Bayar</span>
          )}
        </div>
      </div>
      {/* Upload bukti */}
      {bill.status !== "lunas" && (
        <div className="mt-2 flex flex-col gap-1.5">
          <label className="font-semibold text-xs mb-1">Upload Bukti Pembayaran</label>
          <Input type="file" accept="image/*,application/pdf" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBukti(e.target.files?.[0] || null)} className="text-xs px-2 py-1" />
          <Button onClick={handleUpload} disabled={uploading || !bukti} className="w-full flex items-center justify-center gap-2 text-xs h-9 mt-1">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />} Konfirmasi Pembayaran
          </Button>
        </div>
      )}
    </div>
  );
}