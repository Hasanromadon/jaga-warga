"use client";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import toast, { Toaster } from "react-hot-toast";
import {  Search,  Home, Calendar, Loader2, ChevronDown } from "lucide-react";
import { BillDetail } from "../../components/custom/bill-detail";
import Image from "next/image";


import { BLOK_LIST, BULAN_LIST, TAHUN_LIST } from "../../constants";
import type { Bill } from "../../types";

import { useState } from "react";
import { db, storage } from "../../firebaseConfig";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function WargaPage() {
  const [blok, setBlok] = useState("");
  const [nomor, setNomor] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState<Bill | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bukti, setBukti] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
    const [showForm, setShowForm] = useState(true);

  const handleCari = async () => {
    setLoading(true);
    setError(null);
    setBill(null);
    setSuccess(false);
    try {
      const billsRef = collection(db, "bills");
      const q = query(
        billsRef,
        where("blokRumah", "==", blok),
        where("nomorRumah", "==", nomor),
        where("bulan", "==", bulan),
        where("tahun", "==", tahun)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        setError("Tagihan tidak ditemukan.");
        toast.error("Tagihan tidak ditemukan.");
      } else {
        const data = snap.docs[0].data();
          setBill({ id: snap.docs[0].id, ...data } as Bill);
          setShowForm(false);
      }
    } catch (e) {
      setError("Gagal mencari tagihan.");
      toast.error("Gagal mencari tagihan.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!bill || !bukti) return;
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      const buktiRef = ref(storage, `bukti-bayar/${bill.id}/${bukti.name}`);
      await uploadBytes(buktiRef, bukti);
      const url = await getDownloadURL(buktiRef);
      await updateDoc(doc(db, "bills", bill.id), {
        buktiBayarURL: url,
        status: "pending",
      });
      setSuccess(true);
      setBill({ ...bill, buktiBayarURL: url, status: "pending" });
      toast.success("Bukti berhasil diupload, menunggu verifikasi admin.");
    } catch (e) {
      setError("Gagal upload bukti.");
      toast.error("Gagal upload bukti.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center mt-6 mb-4">
        <div className="rounded-full bg-white shadow-lg p-3 mb-2 flex items-center justify-center">
          <Image src="/logo.svg" alt="Logo IPL" width={56} height={56} className="rounded-full" />
        </div>
        <h1 className="text-xl font-bold text-blue-900 mb-1 text-center">Cek Tagihan IPL</h1>
        <p className="text-xs text-blue-700 text-center mb-2">Masukkan data rumah Anda untuk melihat status tagihan IPL</p>
      </div>
        <Card className="w-full max-w-sm shadow-xl border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              {bill && (
                <button
                  className="w-full text-left font-semibold text-blue-900 bg-blue-50 rounded-lg px-3 py-2 mb-2 border border-blue-100 transition flex items-center justify-between"
                  onClick={() => setShowForm(v => !v)}
                  type="button"
                  aria-expanded={showForm}
                >
                  <span>Cek Tagihan Rumah</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${!showForm ? 'rotate-180' : ''}`} />
                </button>
              )}
              {(showForm || !bill) && (
                <div className="flex flex-col gap-2 animate-fade-in">
                  <Label className="text-xs font-semibold flex items-center gap-1"><Home className="w-4 h-4" />Blok Rumah</Label>
                  <Select value={blok} onValueChange={setBlok}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Blok" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOK_LIST.map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <label className="text-xs font-semibold flex items-center gap-1">Nomor Rumah</label>
                  <Input placeholder="Nomor Rumah" value={nomor} onChange={e => setNomor(e.target.value)} inputMode="numeric" />
                  <Label className="text-xs font-semibold flex items-center gap-1"><Calendar className="w-4 h-4" />Bulan</Label>
                  <Select value={bulan} onValueChange={setBulan}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Bulan" />
                    </SelectTrigger>
                    <SelectContent>
                      {BULAN_LIST.map(b => (
                        <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label className="text-xs font-semibold flex items-center gap-1">Tahun</Label>
                  <Select value={tahun} onValueChange={setTahun}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      {TAHUN_LIST.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleCari} disabled={loading || !blok || !nomor || !bulan || !tahun} className="w-full mt-2 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Cek Tagihan
                  </Button>
                  {/* Error handled by toast, no need for Alert here */}
                  <div className="text-xs text-blue-500 mt-2 text-center">
                    Pastikan blok, nomor rumah, bulan, dan tahun sudah benar sebelum menekan <b>Cek Tagihan</b>.<br />
                    Jika masih ada kendala, hubungi admin IPL (<b>Pak Budi</b>): <a href="https://wa.me/6281234567890" className="underline text-blue-700" target="_blank" rel="noopener noreferrer">0812-3456-7890</a>
                  </div>
                </div>
              )}
              {bill && (
                <BillDetail bill={bill} uploading={uploading} bukti={bukti} setBukti={setBukti} handleUpload={handleUpload} />
              ) }
            </div>
          </CardContent>
        </Card>
      <Toaster position="top-center" />
    </main>
  );
}

// : (
//                 <div className="mt-8 flex flex-col items-center gap-2 animate-fade-in">
//                   <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-2">
//                     <Home className="w-12 h-12 text-blue-200" />
//                   </div>
//                   <div className="text-blue-400 font-semibold text-sm text-center">Belum ada data tagihan ditemukan.<br/>Silakan cari tagihan Anda.</div>
//                 </div>
//               )