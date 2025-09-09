import { UploadCloud, Home, Loader2 } from "lucide-react";
import { BillStatusBadge } from "../ui/BillStatusBadge";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { BULAN_LIST } from "../../constants";
import type { Bill } from "../../types/bill";

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
      {/* Resident address */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-100 p-2 flex items-center justify-center self-start mt-1"><Home className="w-5 h-5 text-blue-600" /></div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="font-bold text-blue-900 text-lg leading-snug break-words whitespace-pre-line mb-0.5">Blok {bill.block} / No. {bill.houseNumber}</div>
        </div>
      </div>
      {/* Amount */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="text-[13px] text-blue-400 font-medium">Jumlah Tagihan</div>
        <div className="text-blue-700 font-extrabold text-2xl tabular-nums leading-tight tracking-tight text-center">{Number(bill.amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}</div>
      </div>
      {/* Divider */}
      <hr className="my-1 border-blue-100" />
      {/* Periode & Status */}
      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[12px] text-blue-400 font-medium">Periode</span>
          <span className="text-blue-700 font-semibold text-sm">{BULAN_LIST.find((b: { value: string; label: string }) => b.value === bill.month)?.label}/{bill.year}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[12px] text-blue-400 font-medium">Status</span>
          <BillStatusBadge status={bill.status} />
        </div>
      </div>
      {/* Upload proof if status is unpaid or rejected */}
      {(bill.status === "unpaid" || bill.status === "rejected") && (
        <div className="my-2 flex flex-col gap-1.5">
          {bill.status === "rejected" && (
            <div className="bg-red-50  border border-red-200 text-red-700 rounded px-3 py-2 text-xs mb-4">
              <div className="font-semibold mb-0.5">Tagihan Ditolak</div>
              {bill.rejectReason ? <div>Alasan: {bill.rejectReason}</div> : <div>Tidak ada alasan penolakan.</div>}
            </div>
          )}
          <label className="font-semibold text-xs mb-1">Unggah {bill.status === "rejected" ? "Ulang " : ""}Bukti Pembayaran</label>
          <Input 
            type="file" 
            accept="image/*,application/pdf" 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0] || null;
              if (file) {
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf", "image/webp", "image/gif"];
                if (!allowedTypes.includes(file.type)) {
                  toast.error("File harus berupa gambar (jpg, png, webp, gif) atau PDF");
                  e.target.value = "";
                  setBukti(null);
                  return;
                }
                if (file.size > 3 * 1024 * 1024) {
                  toast.error("Ukuran file maksimal 3MB");
                  e.target.value = "";
                  setBukti(null);
                  return;
                }
              }
              setBukti(file);
            }} 
            className="text-xs px-2 py-1" 
            aria-label="Unggah bukti pembayaran"
            title="Unggah foto atau PDF bukti pembayaran (maksimal 3MB)"
          />
          <div className="text-[11px] text-blue-500 mt-1">
            Hanya menerima file gambar (JPG, PNG, WEBP, GIF) atau PDF. Ukuran maksimal 3MB.
          </div>
          <Button onClick={handleUpload} disabled={uploading || !bukti} className="w-full flex items-center justify-center gap-2 text-xs h-9 mt-1">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />} {bill.status === "rejected" ? "Upload Ulang" : "Konfirmasi Pembayaran"}
          </Button>
        </div>
      )}
    </div>
  );
}